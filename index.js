'use strict';
const axios = require('axios');
const { dialogflow, Permission, Suggestions } = require('actions-on-google');
const functions = require('firebase-functions');
const app = dialogflow({ debug: true });

app.intent('Default Welcome Intent', (conv) => {
    var greetings = ['Hey I am UNO, how can I help you today?', 'Welcome! My name is Uno, how can I help you today?', 'Welcome! It\'s Uno, how can I help you today?', 'Greetings! My name is Uno, how can I help you today?', 'Greetings! It\'s Uno, how can I help you today?', 'Salutations! My name is Uno, how can I help you today?', 'Salutations! It\'s Uno, how can I help you today?', 'Howdy! My name is Uno, how can I help you today?', 'Howdy! It\'s Uno, how can I help you today?', 'Hello! My name is Uno, how can I help you today?', 'Hello! It\'s Uno, how can I help you today?', 'Hi! My name is Uno, how can I help you today?', 'Hi! It\'s Uno, how can I help you today?'];
    var chosenGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    conv.ask(`${chosenGreeting}`);
  conv.ask(new Suggestions([
    'What do I wear today?',
	'What do I wear?'
  ]));
});
app.intent('Default Fallback Intent', (conv) => {
    conv.data.fallbackCount++;
    // Provide two prompts before ending game
    if (conv.data.fallbackCount === 1) {
        conv.contexts.set(DONE_YES_NO_CONTEXT, 5);
        var closerQuestions = ['Did you decide what you will wear already?', 'Did you pick out an outfit?', 'Did you get an outfit selected?', 'Did you get an outflit picked out?']; // Add
        var chosenCloserQuestion = closerQuestions[Math.floor(Math.random() * closerQuestions.length)];
        conv.ask(`${chosenCloserQuestion}`);
        conv.ask(new Suggestions([
            'Yes', 
            'No'
          ]));
    } else {
        conv.contexts.set(DONE_YES_NO_CONTEXT, 5);
        var closers = ['I am struggling to understand right now, lets talk again soon!', 'I don\'t understand what you want right now, lets talk again soon!', 'I am struggling to understand right now, ask me again!', 'I don\'t understand what you want right now, ask me again!'];
        var chosenCloser = closers[Math.floor(Math.random() * closers.length)];
        conv.close(`${chosenCloser}`);
    }
});
app.intent('Set Gender', (conv, { "gender": gender }) => {
    conv.ask(`What do you identify as?`);
    conv.data.gender = gender;
    conv.ask(new Suggestions([
        'Male', 
        'Female'
      ]));
});
app.intent('Set Temperature Preferences', (conv, { "temperature": temperature, "conditions": condition }) => {
    initialStartup(conv);
    if (condition === 'cold' && temperature < conv.user.storage.modPref) {
        conv.data.coldPref = temperature;
    } else if (condition === 'moderate' && temperature < conv.user.storage.hotPref && temperature > conv.user.storage.coldPref) {
        conv.data.modPref = temperature;
    } else if (condition === 'hot' && temperature > conv.user.storage.modPref) {
        conv.data.hotPref = temperature;
    }
    conv.ask(`Do you want me to save your preferences?`);
    conv.ask(new Suggestions([
        'Yes', 
        'No'
      ]));
});
app.intent('Check Preferences', (conv) => {
    initialStartup(conv);
    if (conv.user.verification === 'VERIFIED') {
        if (conv.user.storage.gender || conv.user.storage.coldPref || conv.user.storage.modPref || conv.user.storage.hotPref) {
            if (conv.user.storage.gender) {
                conv.ask(`Your current gender preference is ${conv.user.storage.gender}`);
            }
            if (conv.user.storage.coldPref) {
                conv.ask(`Your current cold preference is ${conv.user.storage.coldPref}`);
            }
            if (conv.user.storage.modPref) {
                conv.ask(`Your current moderate preference is ${conv.user.storage.modPref}`);
            }
            if (conv.user.storage.hotPref) {
                conv.ask(`Your current hot preference is ${conv.user.storage.hotPref}`);
            }
        } else {
            conv.close(`Would you like to set your preference?`)
            conv.ask(new Suggestions([
                'Yes', 
                'No'
              ]));
        }
    } else {
        conv.close(`We do not have permission to set your preferences. Please sign in to become verified.`);
    }
    conv.ask(new Suggestions([
      'Yes',
      'No'
    ]));
});
app.intent('Save Preferences', (conv) => {
    if (conv.user.verification === 'VERIFIED') {
        conv.user.storage.gender = conv.data.gender;
        conv.user.storage.coldPref = conv.data.coldPref;
        conv.user.storage.modPref = conv.data.modPref;
        conv.user.storage.hotPref = conv.data.hotPref;
        conv.close(`Alright, I'll store that for next time. See you then.`);
    } else {
        conv.close(`I can't save that now, but we can remember them next time!`);
    }
});
app.intent('Wear', (conv, { "geo-city": city, "gender": gender, "occasion": occasion }) => {
    initialStartup(conv);
    console.log(`City is ${city}`);
    if (city != "") {
        return geoCityToCoords(conv, city, gender, occasion);
    } else {
        // TODO: ask for location permissions through google home
        //TODO CHECK IF YOU HAVE PERMISSIONS AND ONLY CALL IF YOU DO NOT
        const { location } = conv.device;
        if (location) {
            const { latitude, longitude } = location.coordinates;
            getLocationIdForAccuweather(conv, latitude, longitude, city, gender, occasion);
        }
        else {
            conv.ask("Do I have your premission to get your location?");
            // ADD SUGGESTION HERE
            conv.ask(new Suggestions([
                'Yes, you do',
                'No, you don\'t'
              ]));
        }
    }
});

function initialStartup(conv) {
    if (conv.user.verification === 'VERIFIED') {
        if (conv.user.storage.gender || conv.user.storage.coldPref || conv.user.storage.modPref || conv.user.storage.hotPref) {
            if (!conv.data.gender) {
                conv.data.gender = '';
            }
            if (!conv.data.coldPref) {
                conv.data.coldPref = 40;
            }
            if (!conv.data.modPref) {
                conv.data.modPref = 55;
            }
            if (!conv.data.hotPref) {
                conv.data.hotPref = 68;
            }
        }
    } else {
        if (!conv.user.storage.gender) {
            conv.user.storage.gender = '';
        }
        if (!conv.user.storage.coldPref) {
            conv.user.storage.coldPref = 40;
        }
        if (!conv.user.storage.modPref) {
            conv.user.storage.modPref = 55;
        }
        if (!conv.user.storage.hotPref) {
            conv.user.storage.hotPref = 68;
        }
        conv.close
    }
}

async function geoCityToCoords(conv, city, gender, occasion) {
    var lat;
    var lng;
    await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}}&key=AIzaSyDRzIANAmqLQ3Dyl5yJzuy49oJBzlmhBQA`)
        .then((result) => {
            console.log(result);
            lat = result.data.results[0].geometry.location.lat;
            lng = result.data.results[0].geometry.location.lng;
            console.log(`The lattitude is ${lat}  and longitude is ${lng}`);
        });
    console.log(`TOMMY LAT HERE ${lng}`);
    return getLocationIdForAccuweather(conv, lat, lng, city, gender, occasion);

}

function decideAndStateOutfit(conv, city, gender, occasion, wind, temp) {
    const intro = ['I recommend you wear a ', 'As your friend, I recommend you wear a ', 'As your stylist, I recommend you wear a ', 'Based off of AccuWeather and Google Data, I recommend you wear a ', 'Based off of data sourced from AccuWeather, I recommend you wear a ', 'According to my calculations, I recommend you wear a ', 'You should wear a ', 'As your friend, I think you should wear a ', 'As your stylist, I think you should wear a ', 'Based off of AccuWeather and Google data, I think you should wear a ', 'Based off of data sourced from Accuweather, I think you should wear a ', 'According to my calculations, I think you should wear a ', 'As your friend, I think you would look great in a ', 'As your stylist, I think you would look great in a ', 'Based off of AccuWeather and Google data, I think you would look great in a ', 'Based off of data sourced from AccuWeather, I think you would look great in a ', 'According to my calculations, I think you would look great in a ', 'As your friend, I think It would great idea to wear a ', 'As your stylist, I think It would great idea to wear a ', 'Based off of AccuWeather and Google data, I think It would great idea to wear a ', 'Based off of data sourced from AccuWeather, I think It would great idea to wear a ', 'According to my calculations, I think It would great idea to wear a ', 'As your friend, I think It would fantastic idea to wear a ', 'As your stylist, I think It would fantastic idea to wear a ', 'Based off of AccuWeather and Google data, I think It would fantastic idea to wear a ', 'Based off of data sourced from AccuWeather, I think It would fantastic idea to wear a ', 'According to my calculations, I think It would fantastic idea to wear a ', 'As your friend, I think It would lovely idea to wear a ', 'As your stylist, I think It would lovely idea to wear a ', 'Based off of AccuWeather and Google data, I think It would lovely idea to wear a ', 'Based off of data sourced from AccuWeather, I think It would lovely idea to wear a ', 'According to my calculations, I think It would lovely idea to wear a ', 'As your friend, I personally recommend you wear a ', 'As your stylist, I personally recommend you wear a ', 'Based off of AccuWeather and Google data, I personally recommend you wear a ', 'Based off of data sourced from AccuWeather, I personally recommend you wear a ', 'According to my calculations, I personally recommend you wear a ', 'As your friend, I think you should wear a ', 'As your stylist, I think you should wear a ', 'Based off of AccuWeather and Google data, I think you should wear a ', 'Based off of data sourced from AccuWeather, I think you should wear a ', 'According to my calculations, I think you should wear a '];

    var coldFormal = ['suit', 'black suit', 'gray suit', 'tan suit', 'dress with tights', 'tuxedo', 'floor length dress'];
    var moderateFormal = ['suit', 'black suit', 'gray suit', 'tan suit', 'dress with tights', 'tuxedo', 'floor length dress', 'dress'];
    var hotFormal = ['suit', 'black suit', 'gray suit', 'tan suit', 'dress', 'skirt suit', 'black skirt suit', 'gray skirt suit', 'tan skirt suit'];

    var coldBusinessCasual = ['button up shirt and slacks', 'button up shirt and khakis', 'sweater and khakis', 'sweater and slacks', 'blouse and khakis', 'dress shirt and slacks', 'dress shirt and khakis'];
    var moderateBusinessCasual = ['button up shirt and pencil skirt', 'dress shirt and pencil skirt', 'blouse and pencil skirt', 'button up shirt and slacks', 'button up shirt and khakis', 'sweater and khakis', 'sweater and slacks', 'blouse and khakis', 'dress shirt and slacks', 'dress shirt and khakis'];
    var hotBusinessCasual = ['slacks and a button up shirt', 'skirt and a button up shirt', 'button up shirt and khakis', 'button up shirt and pencil skirt', 'dress shirt and pencil skirt', 'blouse and pencil skirt', 'button up shirt and slacks', 'blouse and khakis', 'dress shirt and slacks', 'dress shirt and khakis'];

    var coldWorkout = ['quarter zip with leggings', 'quarter zip with sweatpants', 'sweatshirt with leggings', 'sweatshirt with sweatpants', 'long sleeve t-shirt with leggings', 'long sleeve t-shirt with sweatpants'];
    var moderateWorkout = ['quarter zip with leggings', 'quarter zip with sweatpants', 'long sleeve t-shirt with leggings', 'long sleeve t-shirt with sweatpants', 'short sleeve t-shirt with leggings', 'short sleeve t-shirt with sweatpants'];
    var hotWorkout = ['short sleeve t-shirt with leggings', 'short sleeve t-shirt with athletic shorts', 'tank top with leggings', 'tank top with athletic shorts'];

    var coldLazy = ['sweatshirt with sweatpants', 'pajamas', 'long sleeve t-shirt and sweatpants', 'sweatshirt with leggings', 'long sleeve t-shirt and sweatpants'];
    var moderateLazy = ['sweatshirt with sweatpants', 'pajamas', 't-shirt and sweatpants with a jacket'];
    var hotLazy = ['t-shirt with athletic shorts', 'tank top with athletic shorts', 'pajamas'];

    var coldCasual = ['hoodie with jeans', 'sweater and jeans', 'sweater and leggings', 'sweatshirt and leggings', 'sweatshirt and jeans', 'long sleeve t-shirt and leggings', 'long sleeve t-shirt and jeans', 'long sleeve shirt and leggings', 'long sleeve shirt and jeans'];
    var moderateCasual = ['hoodie with jeans', 'hoodie and leggings', 't-shirt and jeans with a jacket', 't-shirt and leggings with a jacket'];
    var hotCasual = ['t-shirt and shorts', 'tank top and shorts', 't-shirt and skirt', 'tank top and skirt'];

    const removedArticlesInWind = ['dress', 'skirt'];
    const removedArticlesMale = ['skirt', 'leggings', 'dress', 'blouse'];
    const removedArticlesFemale = ['tuxedo'];
    const removedArticlesBoth = ['skirt', 'leggings', 'dress', 'blouse', 'tuxedo'];

    if (gender == 'male' || conv.storage.gender == 'male') {
        coldFormal = cleanList(coldFormal, removedArticlesMale);
        moderateFormal = cleanList(moderateFormal, removedArticlesMale);
        hotFormal = cleanList(hotFormal, removedArticlesMale);
        coldBusinessCasual = cleanList(coldBusinessCasual, removedArticlesMale);
        moderateBusinessCasual = cleanList(moderateBusinessCasual, removedArticlesMale);
        hotBusinessCasual = cleanList(hotBusinessCasual, removedArticlesMale);
        coldLazy = cleanList(coldLazy, removedArticlesMale);
        moderateLazy = cleanList(moderateLazy, removedArticlesMale);
        hotLazy = cleanList(hotLazy, removedArticlesMale);
        coldWorkout = cleanList(coldWorkout, removedArticlesMale);
        moderateWorkout = cleanList(moderateWorkout, removedArticlesMale);
        hotWorkout = cleanList(hotWorkout, removedArticlesMale);
        coldCasual = cleanList(coldCasual, removedArticlesMale);
        moderateCasual = cleanList(moderateCasual, removedArticlesMale);
        hotCasual = cleanList(hotCasual, removedArticlesMale);
    } else if (gender == 'female' || conv.storage.gender == 'female') {
        coldFormal = cleanList(coldFormal, removedArticlesFemale);
        moderateFormal = cleanList(moderateFormal, removedArticlesFemale);
        hotFormal = cleanList(hotFormal, removedArticlesFemale);
        coldBusinessCasual = cleanList(coldBusinessCasual, removedArticlesFemale);
        moderateBusinessCasual = cleanList(moderateBusinessCasual, removedArticlesFemale);
        hotBusinessCasual = cleanList(hotBusinessCasual, removedArticlesFemale);
        coldLazy = cleanList(coldLazy, removedArticlesFemale);
        moderateLazy = cleanList(moderateLazy, removedArticlesFemale);
        hotLazy = cleanList(hotLazy, removedArticlesFemale);
        coldWorkout = cleanList(coldWorkout, removedArticlesFemale);
        moderateWorkout = cleanList(moderateWorkout, removedArticlesFemale);
        hotWorkout = cleanList(hotWorkout, removedArticlesFemale);
        coldCasual = cleanList(coldCasual, removedArticlesFemale);
        moderateCasual = cleanList(moderateCasual, removedArticlesFemale);
        hotCasual = cleanList(hotCasual, removedArticlesFemale);
    } else {
        coldFormal = cleanList(coldFormal, removedArticlesBoth);
        moderateFormal = cleanList(moderateFormal, removedArticlesBoth);
        hotFormal = cleanList(hotFormal, removedArticlesBoth);
        coldBusinessCasual = cleanList(coldBusinessCasual, removedArticlesBoth);
        moderateBusinessCasual = cleanList(moderateBusinessCasual, removedArticlesBoth);
        hotBusinessCasual = cleanList(hotBusinessCasual, removedArticlesBoth);
        coldLazy = cleanList(coldLazy, removedArticlesBoth);
        moderateLazy = cleanList(moderateLazy, removedArticlesBoth);
        hotLazy = cleanList(hotLazy, removedArticlesBoth);
        coldWorkout = cleanList(coldWorkout, removedArticlesBoth);
        moderateWorkout = cleanList(moderateWorkout, removedArticlesBoth);
        hotWorkout = cleanList(hotWorkout, removedArticlesBoth);
        coldCasual = cleanList(coldCasual, removedArticlesBoth);
        moderateCasual = cleanList(moderateCasual, removedArticlesBoth);
        hotCasual = cleanList(hotCasual, removedArticlesBoth);
    }

    if (wind >= 20) {
        coldFormal = cleanList(coldFormal, removedArticlesInWind);
        moderateFormal = cleanList(moderateFormal, removedArticlesInWind);
        hotFormal = cleanList(hotFormal, removedArticlesInWind);
        coldBusinessCasual = cleanList(coldBusinessCasual, removedArticlesInWind);
        moderateBusinessCasual = cleanList(moderateBusinessCasual, removedArticlesInWind);
        hotBusinessCasual = cleanList(hotBusinessCasual, removedArticlesInWind);
        coldLazy = cleanList(coldLazy, removedArticlesInWind);
        moderateLazy = cleanList(moderateLazy, removedArticlesInWind);
        hotLazy = cleanList(hotLazy, removedArticlesInWind);
        coldWorkout = cleanList(coldWorkout, removedArticlesInWind);
        moderateWorkout = cleanList(moderateWorkout, removedArticlesInWind);
        hotWorkout = cleanList(hotWorkout, removedArticlesInWind);
        coldCasual = cleanList(coldCasual, removedArticlesInWind);
        moderateCasual = cleanList(moderateCasual, removedArticlesInWind);
        hotCasual = cleanList(hotCasual, removedArticlesInWind);

    }

    // TODO: consider checking day's high and low
    // TODO: temp should put emphasis on feels like

    if (!conv.user.storage.modPref) {
        conv.user.storage.modPref = 68;
    } if (!conv.user.storage.coldPref) {
        conv.user.storage.modPref = 40;
    } if (!conv.user.storage.hotPref) {
        conv.user.storage.modPref = 80;
    }
    if(!gender){
        if(conv.user.storage.gender){
            gender=conv.user.storage.gender;
        }
    }
    var chosenIntro;
    var clothing;
    if (temp <= conv.user.storage.coldPref) { // Cold 
        switch (occasion) {
            case 'Formal':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = coldFormal[Math.floor(Math.random() * coldFormal.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
                break;
            case 'Business Casual':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = coldBusinessCasual[Math.floor(Math.random() * coldBusinessCasual.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
                break;
            case 'Workout':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = coldWorkout[Math.floor(Math.random() * coldWorkout.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
                break;
            case 'Lazy':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = coldLazy[Math.floor(Math.random() * coldLazy.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
                break;
            case 'Casual':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = coldCasual[Math.floor(Math.random() * coldCasual.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
                break;
            default:
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = coldCasual[Math.floor(Math.random() * coldCasual.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
        }
    } else if (temp <= conv.user.storage.modPref) { // Moderate
        switch (occasion) {
            case 'Formal':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = moderateFormal[Math.floor(Math.random() * moderateFormal.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
                break;
            case 'Business Casual':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = moderateBusinessCasual[Math.floor(Math.random() * moderateBusinessCasual.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
                break;
            case 'Workout':
                var chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                var clothing = moderateWorkout[Math.floor(Math.random() * moderateWorkout.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
                break;
            case 'Lazy':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = moderateLazy[Math.floor(Math.random() * moderateLazy.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
                break;
            case 'Casual':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = moderateCasual[Math.floor(Math.random() * moderateCasual.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
                break;
            default:
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = moderateCasual[Math.floor(Math.random() * moderateCasual.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
        }
    } else { // Hot 
        switch (occasion) {
            case 'Formal':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = hotFormal[Math.floor(Math.random() * hotFormal.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
                break;
            case 'Business Casual':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = hotBusinessCasual[Math.floor(Math.random() * hotBusinessCasual.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
                break;
            case 'Workout':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = hotWorkout[Math.floor(Math.random() * hotWorkout.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
                break;
            case 'Lazy':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = hotLazy[Math.floor(Math.random() * hotLazy.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
                break;
            case 'Casual':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = hotCasual[Math.floor(Math.random() * hotCasual.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
                break;
            default:
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = hotCasual[Math.floor(Math.random() * hotCasual.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
        }
    }
}

function cleanList(listOne, listTwo) {
    for (var i = 0; i < listOne.length; ++i) {
        for (var j = 0; j < listTwo.length; ++j) {
            if (listOne[i].includes(listTwo[j])) {
                listOne.splice(i, 1);
            }
        }
    }
    return listOne;
}

async function accuweather(conv, location, city, gender, occasion) {
    console.log(location);
    await axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${location}?apikey=K4BMr74M7Wj03mAhAYgLGxWtbC5rJg2U&language=en-us&details=true&metric=false`)
        .then((result) => {
            console.log(result.data);
            // Pass this to what to what to wear along with other data from entities city, gender, and occasion.
            conv.ask("HEY");
            console.log(result.DailyForecasts[0].RealFeelTemperature);
        })
        .catch((result) => {
            console.log("We screwed up");
        });
    return decideAndStateOutfit(conv, city, gender, occasion, temp, wind);
}

async function getLocationIdForAccuweather(conv, lat, long, city, gender, occasion) {
    console.log(`THE LAT IS ${lat}`)
    var url = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=K4BMr74M7Wj03mAhAYgLGxWtbC5rJg2U&q=${lat}%2C${long}&language=en-us&details=true&toplevel=false`;
    console.log(url);
    var locationKey = "349291"; // Defaults to Omaha
    await axios.get(url)
        .then((result) => {
            console.log(result.headers['x-location-key']);
            locationKey = result.headers['x-location-key'];
        })
        .catch((error) => {
            console.log("We screwed up, no location :(");
            console.log(error);
        });
    console.log(locationKey.toString());
    return accuweather(conv, locationKey.toString(), city, gender, occasion);
}
app.intent('Subscribe to Daily Updates', (conv) => {
    console.log("HERE");
    conv.ask("Cool I will start giving you daily updates!"); // TODO: Make this a list
    /* conv.ask(new RegisterUpdate({
         intent: 'Wear',
         frequency: 'DAILY',
     }));*/ //TODO finalize this implementation
});
app.intent('Permission', (conv) => {
    let context;
    // Location permissions only work for verified users
    // https://developers.google.com/actions/assistant/guest-users
    let permissions;
    if (conv.user.verification === 'VERIFIED') {
        permissions = ['DEVICE_PRECISE_LOCATION'];
        context = 'Will you let me see your location? ';
    }
    const options = {
        context,
        permissions,
    };
    conv.ask(new Permission(options));
    conv.ask(new Suggestions([
        'Yes', 
        'No'
      ]));
});
app.intent('Permission Handler', (conv, params, confirmationGranted) => {
    const { location } = conv.device;
    if (confirmationGranted && location) {
        console.log("Got permissions to get location.");
        conv.add("Thanks, reccomendation coming right up!");
        const { latitude, longitude } = location.coordinates;
        console.log(`lat${latitude} and lng ${longitude}`);
        return getLocationIdForAccuweather(conv, latitude, longitude, "", "", "");
    } else {
        conv.ask(`Looks like I can't get your information.`);
    }
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
