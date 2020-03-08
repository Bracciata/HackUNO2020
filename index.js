'use strict';
const axios = require('axios');

const { dialogflow } = require('actions-on-google');
const functions = require('firebase-functions');

const app = dialogflow({ debug: true });

app.intent('Default Welcome Intent', (conv) => {
    var greetings = ['Hey I am UNO, how can I help you today?']; // Add here
    var chosenGreeting = greetings[Math.floot(Math.random() * greetings.length)];
    conv.ask(`${chosenGreeting}.`);
});
app.intent('Default Fallback Intent', (conv) => {
    conv.data.fallbackCount++;
    // Provide two prompts before ending game
    if (conv.data.fallbackCount === 1) {
        conv.contexts.set(DONE_YES_NO_CONTEXT, 5);
        var closerQuestions = ['Did you decide what you will wear already?']; // Add
        var chosenCloserQuestion = closerQuestions[Math.floot(Math.random() * closerQuestions.length)];

        conv.ask(`${chosenCloserQuestion}`);
    } else {
        conv.contexts.set(DONE_YES_NO_CONTEXT, 5);
        var closers = ['I am struggling to understand right now, lets talk again soon!']; // Add to this
        var chosenCloser = closers[Math.floot(Math.random() * closers.length)];
        conv.close(`${chosenCloser}`);
    }
});
app.intent('Get Gender', (conv, { gender }) => {
    conv.data.gender = gender;
    conv.ask(`Got it!`);
    conv.ask(`What do you consider as cold?`);
    agent.add(conv);
});
app.intent('Get Cold Preference', (conv, { coldPref }) => {
    conv.data.coldPref = coldPref;
    conv.ask(`Got it!`);
    conv.ask(`What do you consider as moderate?`);
    agent.add(conv);
});
app.intent('Get Moderate Preference', (conv, { modPref }) => {
    conv.data.modPref = modPref;
    conv.ask(`Got it!`);
    conv.ask(`What do you consider as hot?`);
    agent.add(conv);
});
app.intent('Get Hot Preference', (conv, { hotPref }) => {
    conv.data.hotPref = hotPref;
    conv.ask(`Got it!`);
    conv.ask(`Should I remember your preferences?`);
    agent.add(conv);
});
app.intent('Check Preferences', (conv) => {
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
    console.log("ye Preferencessssss");
    conv.ask(`Would you like to modify your preferences?`);
    app.intent('Modify Preferences?', (conv) => {
        if (conv.user.verification === 'VERIFIED') {
            deletePortfolio();
            profileSave();
        } else {
            conv.close(`Okay nothing has been deleted.`);
        }
    });
    agent.add(conv);
});
app.intent('Save Preferences', (conv) => {
    if (conv.user.verification === 'VERIFIED') {
        conv.user.storage.gender = conv.data.gender;
        conv.user.storage.coldPref = conv.data.coldPref;
        conv.user.storage.modPref = conv.data.modPref;
        conv.user.storage.hotPref = conv.data.hotPref;
        agent.add(conv);
        conv.close(`Alright, I'll store that for next time. See you then.`);
    } else {
        conv.close(`I can't save that now, but we can remember them next time!`);
    }
    agent.add(conv);
});
app.intent('Wear', (conv, { "geo-city": city }) => {
    console.log(`City is ${city}`);
    if (conv.arguments.get(city) != "") {
        geoCityToCoords(conv, city);
    } else {
        // TODO: ask for location permissions through google home
        permissionChecker(conv);
    }
});
function geoCityToCoords(conv, city) {

    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}}&key=AIzaSyDRzIANAmqLQ3Dyl5yJzuy49oJBzlmhBQA`)
        .then((result) => {
            console.log(result);
            const lat = result.data.results[0].geometry.location.lat;
            const lng = result.data.results[0].geometry.location.lng;
            console.log(`The lattitude is ${lat}  and longitude is ${lng}`);
            getLocationIdForAccuweather(conv, city, lat, lng);
        });
}
function decideAndStateOutfit(agent) {
    // TODO: Figure this code out...
    app.intent('Wear', (conv) => {
        if (conv.user.verification === 'VERIFIED') {
            conv.user.storage.gender = conv.data.gender;
            conv.user.storage.location = conv.data.location;
            conv.close(`Alright, I'll store that for next time. See you then.`);
        } else {
            //conv.close(`I can't save that right now, but we can add it next time!`);
        }
    });



    const intros = ['I recommend you wear', 'You should wear'];

    const coldFormal = ['suit'];
    const moderateFormal = ['suit', 'dress'];
    const hotFormal = ['suit', 'dress', 'skirt suit'];

    const coldBusinessCasual = ['button up shirt and slacks', 'button up shirt and khakis', 'sweater and khakis'];
    const moderateBusinessCasual = ['button up shirt and slacks', 'button up shirt and khakis'];
    const hotBusinessCasual = ['slacks and a button up shirt', 'a skirt and a button up shirt', 'button up shirt and khakis'];

    const coldWorkout = ['quarter zip with leggings', 'quarter zip with sweatpants', 'sweatshirt with leggings', 'sweatshirt with sweatpants', 'long sleeve t-shirt with leggings', 'long sleeve t-shirt with sweatpants'];
    const moderateWorkout = ['quarter zip with leggings', 'quarter zip with sweatpants', 'long sleeve t-shirt with leggings', 'long sleeve t-shirt with sweatpants', 'short sleeve t-shirt with leggings', 'short sleeve t-shirt with sweatpants'];
    const hotWorkout = ['short sleeve t-shirt with leggings', 'short sleeve t-shirt with athletic shorts', 'tank top with leggings', 'tank top with athletic shorts'];

    const coldLazy = ['sweatshirt with sweatpants', 'pajamas', 't-shirt and sweatpants with a coat', 'sweatshirt with leggings', 't-shirt and sweatpants with a coat'];
    const moderateLazy = ['sweatshirt with sweatpants', 'pajamas', 't-shirt and sweatpants with a jacket'];
    const hotLazy = ['t-shirt with athletic shorts', 'tank top with athletic shorts'];

    const coldCasual = ['hoodie with jeans and a coat', 'sweater and jeans'];
    const moderateCasual = ['hoodie with jeans'];
    const hotCasual = ['t-shirt and shorts'];

    const removedArticlesInWind = ['dress', 'skirt'];
    const removedArticlesMale = ['skirt', 'leggings', 'dress'];
    if (agent.parameters.gender != 'female') {
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
    // TODO: remove skirt, leggings, dress items from lists
    if (temp <= 40) { // Cold 
        switch (agent.parameters.occasion) {
            case 'Formal':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = coldFormal[Math.floor(Math.random() * coldFormal.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
            case 'Business Casual':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = coldBusinessCasual[Math.floor(Math.random() * coldBusinessCasual.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
            case 'Workout':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = coldWorkout[Math.floor(Math.random() * coldWorkout.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
            case 'Lazy':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = coldLazy[Math.floor(Math.random() * coldLazy.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
            case 'Casual':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = coldCasual[Math.floor(Math.random() * coldCasual.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
            default:
            // do something
        }
    } else if (temp <= 68) { // Moderate


        switch (agent.parameters.occasion) {
            case 'Formal':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = moderateFormal[Math.floor(Math.random() * moderateFormal.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
            case 'Business Casual':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = moderateBusinessCasual[Math.floor(Math.random() * moderateBusinessCasual.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
            case 'Workout':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = moderateWorkout[Math.floor(Math.random() * moderateWorkout.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
            case 'Lazy':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = moderateLazy[Math.floor(Math.random() * moderateLazy.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
            case 'Casual':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = moderateCasual[Math.floor(Math.random() * moderateCasual.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
            default:
                // do something
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = moderateCasual[Math.floor(Math.random() * moderateCasual.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
        }
    } else { // Hot 

        switch (agent.parameters.occasion) {
            case 'Formal':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = hotFormal[Math.floor(Math.random() * hotFormal.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
            case 'Business Casual':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = hotBusinessCasual[Math.floor(Math.random() * hotBusinessCasual.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
            case 'Workout':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = hotWorkout[Math.floor(Math.random() * hotWorkout.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
            case 'Lazy':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = hotLazy[Math.floor(Math.random() * hotLazy.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
            case 'Casual':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = hotCasual[Math.floor(Math.random() * hotCasual.length)]
                conv.ask(`${chosenIntro} ${clothing}.`);
            default:
                // do something
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = hotCasual[Math.floor(Math.random() * hotCasual.length)]
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
function accuweather(conv, location) {
    console.log(location);
    return axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${location}?apikey=Ol2aGPmTdX43J1JOsQmMLEeu6eouZ6bX&language=en-us&details=true&metric=false`)
        .then((result) => {
            console.log(result.data);
        })
        .catch((result) => {
            console.log("We screwed up");
        });
}

function getLocationIdForAccuweather(conv, lat, long) {
    return axios.get(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=Ol2aGPmTdX43J1JOsQmMLEeu6eouZ6bX&q=${lat}%2C${long}&language=en-us&details=true&toplevel=false`)
        .then((result) => {
            console.log(result.headers['x-location-key']);
            accuweather(agent, result.headers['x-location-key'].toString());
        })
        .catch((error) => {
            console.log("We screewed up, no location :(");
            console.log(error);
        });
}
app.intent('Subscribe to Daily Updates', (conv) => {
  console.log("HERE");
    conv.ask("Cool I will start giving you daily updates!"); // TODO: MAke this a list
   /* conv.ask(new RegisterUpdate({
        intent: 'Wear',
        frequency: 'DAILY',
    }));*/ //TODO finalize this implementation
});
app.intent('Permission', (conv) => {
  console.log("HEYTOMMAYYYYYY");
    let context = 'Will you let me see your location? ';
    // Location permissions only work for verified users
    // https://developers.google.com/actions/assistant/guest-users
    if (conv.user.verification === 'VERIFIED') {
      // Could use DEVICE_COARSE_LOCATION instead for city, zip code
      permissions.push('DEVICE_PRECISE_LOCATION');
    }
    const options = {
      context,
      permissions,
    };
    conv.ask(new Permission(options));
  });
  // [END df_js_permission_reason]
  
  // [START df_js_permission_accepted]
  app.intent('Permission Handler', (conv, params, confirmationGranted) => {
    // Also, can access latitude and longitude
    // const { latitude, longitude } = location.coordinates;
    const {location} = conv.device;
    if (confirmationGranted && location) {
      console.log("ACCEPTED");
        conv.add("Thanks, reccomendation coming right up!")
      // Get accuweather
    } else {
      conv.ask(`Looks like I can't get your information.`);
    }
  });
  // [END df_js_permission_accepted]


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
