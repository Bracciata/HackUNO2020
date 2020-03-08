// Lambda Function code for Alexa.
// Paste this into your index.js file. 

const Alexa = require("ask-sdk-core");
const https = require("https");



const invocationName = "get uno";

// Session Attributes 
//   Alexa will track attributes for you, by default only during the lifespan of your session.
//   The history[] array will track previous request(s), used for contextual Help/Yes/No handling.
//   Set up DynamoDB persistence to have the skill save and reload these attributes between skill sessions.

function getMemoryAttributes() {
    const memoryAttributes = {
        "history": [],

        // The remaining attributes will be useful after DynamoDB persistence is configured
        "launchCount": 0,
        "lastUseTimestamp": 0,

        "lastSpeechOutput": {},
        "nextIntent": []

        // "favoriteColor":"",
        // "name":"",
        // "namePronounce":"",
        // "email":"",
        // "mobileNumber":"",
        // "city":"",
        // "state":"",
        // "postcode":"",
        // "birthday":"",
        // "bookmark":0,
        // "wishlist":[],
    };
    return memoryAttributes;
};

const maxHistorySize = 20; // remember only latest 20 intents 


// 1. Intent Handlers =============================================
const Wear_Handler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'Wear';
    },
    async handle(handlerInput) {
        //const response = await httpGet('https://dataservice.accuweather.com', '/forecasts/v1/daily/5day/349291?apikey=K4BMr74M7Wj03mAhAYgLGxWtbC5rJg2U&language=en-us&details=true&metric=false');


        //console.log(response);
        var wind = 18;
        var precipitation = false;
        var temp = 50;
        var out = "";
        if (x === 0) {
            out = decideAndStateOutfit('Denver', 'male', 'formal', false, 50);
            x += 1;
        }
        else {
            out = decideAndStateOutfit('Omaha', 'male', 'lazy', false, 50);
            x -= 1;
        }
        return handlerInput.responseBuilder
            .speak(out)
            .reprompt("Any other questions?")
            .getResponse();
    },
};
const SetTemperaturePreferences_Handler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'SetTemperaturePreferences';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'Hello from SetTemperaturePreferences. ';

        let slotStatus = '';
        let resolvedSlot;

        let slotValues = getSlotValues(request.intent.slots);
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        //   SLOT: conditionsslot 
        if (slotValues.conditionsslot.heardAs) {
            slotStatus += ' slot conditionsslot was heard as ' + slotValues.conditionsslot.heardAs + '. ';
        } else {
            slotStatus += 'slot conditionsslot is empty. ';
        }
        if (slotValues.conditionsslot.ERstatus === 'ER_SUCCESS_MATCH') {
            slotStatus += 'a valid ';
            if (slotValues.conditionsslot.resolved !== slotValues.conditionsslot.heardAs) {
                slotStatus += 'synonym for ' + slotValues.conditionsslot.resolved + '. ';
            } else {
                slotStatus += 'match. '
            } // else {
            //
        }
        if (slotValues.conditionsslot.ERstatus === 'ER_SUCCESS_NO_MATCH') {
            slotStatus += 'which did not match any slot value. ';
            console.log('***** consider adding "' + slotValues.conditionsslot.heardAs + '" to the custom slot type used by slot conditionsslot! ');
        }

        if ((slotValues.conditionsslot.ERstatus === 'ER_SUCCESS_NO_MATCH') || (!slotValues.conditionsslot.heardAs)) {
            slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('SetTemperaturePreferences', 'conditionsslot'), 'or');
        }
        //   SLOT: numberslot 
        if (slotValues.numberslot.heardAs) {
            slotStatus += ' slot numberslot was heard as ' + slotValues.numberslot.heardAs + '. ';
        } else {
            slotStatus += 'slot numberslot is empty. ';
        }
        if (slotValues.numberslot.ERstatus === 'ER_SUCCESS_MATCH') {
            slotStatus += 'a valid ';
            if (slotValues.numberslot.resolved !== slotValues.numberslot.heardAs) {
                slotStatus += 'synonym for ' + slotValues.numberslot.resolved + '. ';
            } else {
                slotStatus += 'match. '
            } // else {
            //
        }
        if (slotValues.numberslot.ERstatus === 'ER_SUCCESS_NO_MATCH') {
            slotStatus += 'which did not match any slot value. ';
            console.log('***** consider adding "' + slotValues.numberslot.heardAs + '" to the custom slot type used by slot numberslot! ');
        }

        if ((slotValues.numberslot.ERstatus === 'ER_SUCCESS_NO_MATCH') || (!slotValues.numberslot.heardAs)) {
            slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('SetTemperaturePreferences', 'numberslot'), 'or');
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};

const SetGender_Handler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'SetGender';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'Hello from SetGender. ';

        let slotStatus = '';
        let resolvedSlot;

        let slotValues = getSlotValues(request.intent.slots);
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        //   SLOT: genderslot 
        if (slotValues.genderslot.heardAs) {
            slotStatus += ' slot genderslot was heard as ' + slotValues.genderslot.heardAs + '. ';
        } else {
            slotStatus += 'slot genderslot is empty. ';
        }
        if (slotValues.genderslot.ERstatus === 'ER_SUCCESS_MATCH') {
            slotStatus += 'a valid ';
            if (slotValues.genderslot.resolved !== slotValues.genderslot.heardAs) {
                slotStatus += 'synonym for ' + slotValues.genderslot.resolved + '. ';
            } else {
                slotStatus += 'match. '
            } // else {
            //
        }
        if (slotValues.genderslot.ERstatus === 'ER_SUCCESS_NO_MATCH') {
            slotStatus += 'which did not match any slot value. ';
            console.log('***** consider adding "' + slotValues.genderslot.heardAs + '" to the custom slot type used by slot genderslot! ');
        }

        if ((slotValues.genderslot.ERstatus === 'ER_SUCCESS_NO_MATCH') || (!slotValues.genderslot.heardAs)) {
            slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('SetGender', 'genderslot'), 'or');
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};

const SavePreferences_Handler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'SavePreferences';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'Hello from SavePreferences. ';


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};

const Permission_Handler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'Permission';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'Hello from Permission. ';


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};
let x = 0;
function httpGet(host, path) {
    return new Promise(((resolve, reject) => {
        var options = {
            host: host,
            port: 443,
            path: path,
            method: 'GET',
        };

        const request = https.request(options, (response) => {
            response.setEncoding('utf8');
            let returnData = '';

            response.on('data', (chunk) => {
                returnData += chunk;
            });

            response.on('end', () => {
                resolve(JSON.parse(returnData));
            });

            response.on('error', (error) => {
                reject(error);
            });
        });
        request.end();
    }));
}
function decideAndStateOutfit(city, gender, occasion, wind, temp) {
    console.log("HIT ME");
    const intro = ['I recommend you wear a ', 'As your friend, I recommend you wear a ', 'As your stylist, I recommend you wear a ', 'Based off of AccuWeather and Google Data, I recommend you wear a ', 'Based off of data sourced from AccuWeather, I recommend you wear a ', 'According to my calculations, I recommend you wear a ', 'You should wear a ', 'As your friend, I think you should wear a ', 'As your stylist, I think you should wear a ', 'Based off of AccuWeather and Google data, I think you should wear a ', 'Based off of data sourced from Accuweather, I think you should wear a ', 'According to my calculations, I think you should wear a ', 'As your friend, I think you would look great in a ', 'As your stylist, I think you would look great in a ', 'Based off of AccuWeather and Google data, I think you would look great in a ', 'Based off of data sourced from AccuWeather, I think you would look great in a ', 'According to my calculations, I think you would look great in a ', 'As your friend, I think It would great idea to wear a ', 'As your stylist, I think It would great idea to wear a ', 'Based off of AccuWeather and Google data, I think It would great idea to wear a ', 'Based off of data sourced from AccuWeather, I think It would great idea to wear a ', 'According to my calculations, I think It would great idea to wear a ', 'As your friend, I think It would be a fantastic idea to wear a ', 'As your stylist, I think It would be a fantastic idea to wear a ', 'Based off of AccuWeather and Google data, I think It would be a fantastic idea to wear a ', 'Based off of data sourced from AccuWeather, I think It would be a fantastic idea to wear a ', 'According to my calculations, I think It would be a fantastic idea to wear a ', 'As your friend, I think It would lovely idea to wear a ', 'As your stylist, I think It would lovely idea to wear a ', 'Based off of AccuWeather and Google data, I think It would lovely idea to wear a ', 'Based off of data sourced from AccuWeather, I think It would lovely idea to wear a ', 'According to my calculations, I think It would lovely idea to wear a ', 'As your friend, I personally recommend you wear a ', 'As your stylist, I personally recommend you wear a ', 'Based off of AccuWeather and Google data, I personally recommend you wear a ', 'Based off of data sourced from AccuWeather, I personally recommend you wear a ', 'According to my calculations, I personally recommend you wear a ', 'As your friend, I think you should wear a ', 'As your stylist, I think you should wear a ', 'Based off of AccuWeather and Google data, I think you should wear a ', 'Based off of data sourced from AccuWeather, I think you should wear a ', 'According to my calculations, I think you should wear a '];

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

    if (!gender) {
        gender = 'female';
    }
    if (gender) {
        if (gender === 'male') {
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
        } else if (gender === 'female') {
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
        }
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


    var chosenIntro;
    var clothing;
    if (temp <= 40) { // Cold 
        switch (occasion) {
            case 'formal':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = coldFormal[Math.floor(Math.random() * coldFormal.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'business casual':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = coldBusinessCasual[Math.floor(Math.random() * coldBusinessCasual.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'workout':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = coldWorkout[Math.floor(Math.random() * coldWorkout.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'lazy':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = coldLazy[Math.floor(Math.random() * coldLazy.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'casual':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = coldCasual[Math.floor(Math.random() * coldCasual.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            default:
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = coldCasual[Math.floor(Math.random() * coldCasual.length)];
                return `${chosenIntro} ${clothing}.`;
        }
    } else if (temp <= 68) { // Moderate
        switch (occasion) {
            case 'formal':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = moderateFormal[Math.floor(Math.random() * moderateFormal.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'business casual':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = moderateBusinessCasual[Math.floor(Math.random() * moderateBusinessCasual.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'workout':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = moderateWorkout[Math.floor(Math.random() * moderateWorkout.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'lazy':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = moderateLazy[Math.floor(Math.random() * moderateLazy.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'casual':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = moderateCasual[Math.floor(Math.random() * moderateCasual.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            default:
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = moderateCasual[Math.floor(Math.random() * moderateCasual.length)];
                return `${chosenIntro} ${clothing}.`;
        }
    } else { // Hot 
        switch (occasion) {
            case 'formal':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = hotFormal[Math.floor(Math.random() * hotFormal.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'business casual':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = hotBusinessCasual[Math.floor(Math.random() * hotBusinessCasual.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'workout':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = hotWorkout[Math.floor(Math.random() * hotWorkout.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'lazy':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = hotLazy[Math.floor(Math.random() * hotLazy.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'casual':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = hotCasual[Math.floor(Math.random() * hotCasual.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            default:
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = hotCasual[Math.floor(Math.random() * hotCasual.length)];
                return `${chosenIntro} ${clothing}.`;
        }
    }
}
const DefaultWelcomeIntent_Handler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'DefaultWelcomeIntent';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'Hello from DefaultWelcomeIntent. ';


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};
const DefaultFallbackIntent_Handler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'DefaultFallbackIntent';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'Hello from DefaultFallbackIntent. ';


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};



function cleanList(listOne, listTwo) {
    for (var i = 0; i < listOne.length; ++i) {
        for (var j = 0; j < listTwo.length; ++j) {
            if (listOne[i].toLowerCase().includes(listTwo[j].toLowerCase()) || listTwo[j].toLowerCase().includes(listOne[i].toLowerCase())) {
                try {
                    listOne.splice(i, 1);
                    break;
                }

                catch (err) {
                    listOne = cleanList(listOne, listTwo);
                }
            }
        }
    }
    return listOne;
}
const CheckOptions_Handler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'CheckOptions';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'Hello from CheckOptions. ';


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};

const SubscribeToDailyUpdates_Handler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'SubscribeToDailyUpdates';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'Hello from SubscribeToDailyUpdates. ';

        let slotStatus = '';
        let resolvedSlot;

        let slotValues = getSlotValues(request.intent.slots);
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        //   SLOT: datetimeslot 
        if (slotValues.datetimeslot.heardAs) {
            slotStatus += ' slot datetimeslot was heard as ' + slotValues.datetimeslot.heardAs + '. ';
        } else {
            slotStatus += 'slot datetimeslot is empty. ';
        }
        if (slotValues.datetimeslot.ERstatus === 'ER_SUCCESS_MATCH') {
            slotStatus += 'a valid ';
            if (slotValues.datetimeslot.resolved !== slotValues.datetimeslot.heardAs) {
                slotStatus += 'synonym for ' + slotValues.datetimeslot.resolved + '. ';
            } else {
                slotStatus += 'match. '
            } // else {
            //
        }
        if (slotValues.datetimeslot.ERstatus === 'ER_SUCCESS_NO_MATCH') {
            slotStatus += 'which did not match any slot value. ';
            console.log('***** consider adding "' + slotValues.datetimeslot.heardAs + '" to the custom slot type used by slot datetimeslot! ');
        }

        if ((slotValues.datetimeslot.ERstatus === 'ER_SUCCESS_NO_MATCH') || (!slotValues.datetimeslot.heardAs)) {
            slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('SubscribeToDailyUpdates', 'datetimeslot'), 'or');
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};

const AMAZON_StopIntent_Handler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.StopIntent';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();


        let say = 'Okay, talk to you later! ';

        return responseBuilder
            .speak(say)
            .withShouldEndSession(true)
            .getResponse();
    },
};

const AMAZON_NavigateHomeIntent_Handler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NavigateHomeIntent';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'Hello from AMAZON.NavigateHomeIntent. ';


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};

const LaunchRequest_Handler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const responseBuilder = handlerInput.responseBuilder;

        let say = 'Howday its uhhh meeee Uno. How can I help you today? ';

        let skillTitle = capitalize(invocationName);


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withStandardCard('Welcome!',
                'Hello!\nThis is a card for your skill, ' + skillTitle,
                welcomeCardImg.smallImageUrl, welcomeCardImg.largeImageUrl)
            .getResponse();
    },
};

const SessionEndedHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const request = handlerInput.requestEnvelope.request;

        console.log(`Error handled: ${error.message}`);
        // console.log(`Original Request was: ${JSON.stringify(request, null, 2)}`);

        return handlerInput.responseBuilder
            .speak('Sorry, an error occurred.  Please say again.')
            .reprompt('Sorry, an error occurred.  Please say again.')
            .getResponse();
    }
};


// 2. Constants ===========================================================================

// Here you can define static data, to be used elsewhere in your code.  For example: 
//    const myString = "Hello World";
//    const myArray  = [ "orange", "grape", "strawberry" ];
//    const myObject = { "city": "Boston",  "state":"Massachusetts" };

const APP_ID = undefined;  // TODO replace with your Skill ID (OPTIONAL).

// 3.  Helper Functions ===================================================================

function capitalize(myString) {

    return myString.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
}


function randomElement(myArray) {
    return (myArray[Math.floor(Math.random() * myArray.length)]);
}

function stripSpeak(str) {
    return (str.replace('<speak>', '').replace('</speak>', ''));
}




function getSlotValues(filledSlots) {
    const slotValues = {};

    Object.keys(filledSlots).forEach((item) => {
        const name = filledSlots[item].name;

        if (filledSlots[item] &&
            filledSlots[item].resolutions &&
            filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
            filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
            filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
            switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
                case 'ER_SUCCESS_MATCH':
                    slotValues[name] = {
                        heardAs: filledSlots[item].value,
                        resolved: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
                        ERstatus: 'ER_SUCCESS_MATCH'
                    };
                    break;
                case 'ER_SUCCESS_NO_MATCH':
                    slotValues[name] = {
                        heardAs: filledSlots[item].value,
                        resolved: '',
                        ERstatus: 'ER_SUCCESS_NO_MATCH'
                    };
                    break;
                default:
                    break;
            }
        } else {
            slotValues[name] = {
                heardAs: filledSlots[item].value,
                resolved: '',
                ERstatus: ''
            };
        }
    }, this);

    return slotValues;
}

function getExampleSlotValues(intentName, slotName) {

    let examples = [];
    let slotType = '';
    let slotValuesFull = [];

    let intents = model.interactionModel.languageModel.intents;
    for (let i = 0; i < intents.length; i++) {
        if (intents[i].name == intentName) {
            let slots = intents[i].slots;
            for (let j = 0; j < slots.length; j++) {
                if (slots[j].name === slotName) {
                    slotType = slots[j].type;

                }
            }
        }

    }
    let types = model.interactionModel.languageModel.types;
    for (let i = 0; i < types.length; i++) {
        if (types[i].name === slotType) {
            slotValuesFull = types[i].values;
        }
    }


    examples.push(slotValuesFull[0].name.value);
    examples.push(slotValuesFull[1].name.value);
    if (slotValuesFull.length > 2) {
        examples.push(slotValuesFull[2].name.value);
    }


    return examples;
}

function sayArray(myData, penultimateWord = 'and') {
    let result = '';

    myData.forEach(function (element, index, arr) {

        if (index === 0) {
            result = element;
        } else if (index === myData.length - 1) {
            result += ` ${penultimateWord} ${element}`;
        } else {
            result += `, ${element}`;
        }
    });
    return result;
}
function supportsDisplay(handlerInput) // returns true if the skill is running on a device with a display (Echo Show, Echo Spot, etc.) 
{                                      //  Enable your skill for display as shown here: https://alexa.design/enabledisplay 
    const hasDisplay =
        handlerInput.requestEnvelope.context &&
        handlerInput.requestEnvelope.context.System &&
        handlerInput.requestEnvelope.context.System.device &&
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display;

    return hasDisplay;
}


const welcomeCardImg = {
    smallImageUrl: "https://s3.amazonaws.com/skill-images-789/cards/card_plane720_480.png",
    largeImageUrl: "https://s3.amazonaws.com/skill-images-789/cards/card_plane1200_800.png"


};

const DisplayImg1 = {
    title: 'Jet Plane',
    url: 'https://s3.amazonaws.com/skill-images-789/display/plane340_340.png'
};
const DisplayImg2 = {
    title: 'Starry Sky',
    url: 'https://s3.amazonaws.com/skill-images-789/display/background1024_600.png'

};

function getCustomIntents() {
    const modelIntents = model.interactionModel.languageModel.intents;

    let customIntents = [];


    for (let i = 0; i < modelIntents.length; i++) {

        if (modelIntents[i].name.substring(0, 7) != "AMAZON." && modelIntents[i].name !== "LaunchRequest") {
            customIntents.push(modelIntents[i]);
        }
    }
    return customIntents;
}

function getSampleUtterance(intent) {

    return randomElement(intent.samples);

}

function getPreviousIntent(attrs) {

    if (attrs.history && attrs.history.length > 1) {
        return attrs.history[attrs.history.length - 2].IntentRequest;

    } else {
        return false;
    }

}

function getPreviousSpeechOutput(attrs) {

    if (attrs.lastSpeechOutput && attrs.history.length > 1) {
        return attrs.lastSpeechOutput;

    } else {
        return false;
    }

}

function timeDelta(t1, t2) {

    const dt1 = new Date(t1);
    const dt2 = new Date(t2);
    const timeSpanMS = dt2.getTime() - dt1.getTime();
    const span = {
        "timeSpanMIN": Math.floor(timeSpanMS / (1000 * 60)),
        "timeSpanHR": Math.floor(timeSpanMS / (1000 * 60 * 60)),
        "timeSpanDAY": Math.floor(timeSpanMS / (1000 * 60 * 60 * 24)),
        "timeSpanDesc": ""
    };


    if (span.timeSpanHR < 2) {
        span.timeSpanDesc = span.timeSpanMIN + " minutes";
    } else if (span.timeSpanDAY < 2) {
        span.timeSpanDesc = span.timeSpanHR + " hours";
    } else {
        span.timeSpanDesc = span.timeSpanDAY + " days";
    }


    return span;

}


const InitMemoryAttributesInterceptor = {
    process(handlerInput) {
        let sessionAttributes = {};
        if (handlerInput.requestEnvelope.session['new']) {

            sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

            let memoryAttributes = getMemoryAttributes();

            if (Object.keys(sessionAttributes).length === 0) {

                Object.keys(memoryAttributes).forEach(function (key) {  // initialize all attributes from global list 

                    sessionAttributes[key] = memoryAttributes[key];

                });

            }
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);


        }
    }
};

const RequestHistoryInterceptor = {
    process(handlerInput) {

        const thisRequest = handlerInput.requestEnvelope.request;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let history = sessionAttributes['history'] || [];

        let IntentRequest = {};
        if (thisRequest.type === 'IntentRequest') {

            let slots = [];

            IntentRequest = {
                'IntentRequest': thisRequest.intent.name
            };

            if (thisRequest.intent.slots) {

                for (let slot in thisRequest.intent.slots) {
                    let slotObj = {};
                    slotObj[slot] = thisRequest.intent.slots[slot].value;
                    slots.push(slotObj);
                }

                IntentRequest = {
                    'IntentRequest': thisRequest.intent.name,
                    'slots': slots
                };

            }

        } else {
            IntentRequest = { 'IntentRequest': thisRequest.type };
        }
        if (history.length > maxHistorySize - 1) {
            history.shift();
        }
        history.push(IntentRequest);

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    }

};




const RequestPersistenceInterceptor = {
    process(handlerInput) {

        if (handlerInput.requestEnvelope.session['new']) {

            return new Promise((resolve, reject) => {

                handlerInput.attributesManager.getPersistentAttributes()

                    .then((sessionAttributes) => {
                        sessionAttributes = sessionAttributes || {};


                        sessionAttributes['launchCount'] += 1;

                        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

                        handlerInput.attributesManager.savePersistentAttributes()
                            .then(() => {
                                resolve();
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    });

            });

        } // end session['new'] 
    }
};


const ResponseRecordSpeechOutputInterceptor = {
    process(handlerInput, responseOutput) {

        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let lastSpeechOutput = {
            "outputSpeech": responseOutput.outputSpeech.ssml,
            "reprompt": responseOutput.reprompt.outputSpeech.ssml
        };

        sessionAttributes['lastSpeechOutput'] = lastSpeechOutput;

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    }
};

const ResponsePersistenceInterceptor = {
    process(handlerInput, responseOutput) {

        const ses = (typeof responseOutput.shouldEndSession == "undefined" ? true : responseOutput.shouldEndSession);

        if (ses || handlerInput.requestEnvelope.request.type == 'SessionEndedRequest') { // skill was stopped or timed out 

            let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

            sessionAttributes['lastUseTimestamp'] = new Date(handlerInput.requestEnvelope.request.timestamp).getTime();

            handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);

            return new Promise((resolve, reject) => {
                handlerInput.attributesManager.savePersistentAttributes()
                    .then(() => {
                        resolve();
                    })
                    .catch((err) => {
                        reject(err);
                    });

            });

        }

    }
};



// 4. Exports handler function and setup ===================================================
const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
    .addRequestHandlers(
        Wear_Handler,
        SetTemperaturePreferences_Handler,
        SetGender_Handler,
        SavePreferences_Handler,
        Permission_Handler,
        DefaultWelcomeIntent_Handler,
        DefaultFallbackIntent_Handler,
        CheckOptions_Handler,
        SubscribeToDailyUpdates_Handler,
        AMAZON_StopIntent_Handler,
        AMAZON_NavigateHomeIntent_Handler,
        LaunchRequest_Handler,
        SessionEndedHandler
    )
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(InitMemoryAttributesInterceptor)
    .addRequestInterceptors(RequestHistoryInterceptor)

    // .addResponseInterceptors(ResponseRecordSpeechOutputInterceptor)

    // .addRequestInterceptors(RequestPersistenceInterceptor)
    // .addResponseInterceptors(ResponsePersistenceInterceptor)

    // .withTableName("askMemorySkillTable")
    // .withAutoCreateTable(true)

    .lambda();


// End of Skill code -------------------------------------------------------------
// Static Language Model for reference

const model = {
    "interactionModel": {
        "languageModel": {
            "invocationName": "get uno",
            "intents": [
                {
                    "name": "SetTemperaturePreferences",
                    "slots": [
                        {
                            "name": "conditionsslot",
                            "type": "CONDITIONS"
                        },
                        {
                            "name": "numberslot",
                            "type": "AMAZON.NUMBER"
                        }
                    ],
                    "samples": [
                        "i am {conditionsslot} at {numberslot}",
                        "i feel the weather is {conditionsslot} when",
                        "i feel {conditionsslot} at forty two degrees",
                        "i feel {conditionsslot} at sixty degrees",
                        "i feel {conditionsslot} when",
                        "i prefer it to {conditionsslot}",
                        "i prefer my temps to be",
                        "it is {conditionsslot} under thirty degrees",
                        "set my temp preferences for {conditionsslot}",
                        "set my temperature preferences.",
                        "set temp",
                        "set temp preferences",
                        "set when i feel the temperature is {conditionsslot}"
                    ]
                },
                {
                    "name": "SetGender",
                    "slots": [
                        {
                            "name": "genderslot",
                            "type": "GENDER"
                        }
                    ],
                    "samples": [
                        "{genderslot}",
                        "a {genderslot}",
                        "an {genderslot}",
                        "i am a {genderslot}",
                        "i am considered a {genderslot}",
                        "i am considered {genderslot}",
                        "i am {genderslot}",
                        "i consider myself a {genderslot}",
                        "i identify as a {genderslot}",
                        "i m a {genderslot}"
                    ]
                },
                {
                    "name": "SavePreferences",
                    "slots": [],
                    "samples": [
                        "i want to remember my preferences",
                        "save my preference",
                        "save my preferences",
                        "yes",
                        "yes i want to save my preference"
                    ]
                },
                {
                    "name": "Permission",
                    "slots": [],
                    "samples": [
                        "get my location",
                        "i am at",
                        "what is my location",
                        "you have permission to get my location"
                    ]
                },
                {
                    "name": "DefaultWelcomeIntent",
                    "slots": [],
                    "samples": [
                        "a good day",
                        "greetings",
                        "hello",
                        "hello again",
                        "hello hi",
                        "hello there",
                        "hey",
                        "hey there",
                        "heya",
                        "hi",
                        "hi there",
                        "howdy",
                        "i greet you",
                        "just going to say hi",
                        "long time no see",
                        "lovely day isn't it"
                    ]
                },
                {
                    "name": "DefaultFallbackIntent",
                    "slots": [],
                    "samples": [
                        "get",
                        "hot",
                        "i feel old at forty two degrees",
                        "no",
                        "test"
                    ]
                },
                {
                    "name": "Wear",
                    "slots": [
                        {
                            "name": "occasionslot",
                            "type": "OCCASION"
                        },
                        {
                            "name": "datetimeslot",
                            "type": "AMAZON.DATE"
                        },
                        {
                            "name": "genderslot",
                            "type": "GENDER"
                        }
                    ],
                    "samples": [
                        "{datetimeslot}",
                        "{genderslot} wear {datetimeslot}",
                        "{occasionslot} to uno",
                        "wear",
                        "wear {genderslot} {datetimeslot}",
                        "what do i wear {datetimeslot}",
                        "what do you recommend for a {genderslot} to wear {datetimeslot}",
                        "what should a {genderslot} wear {datetimeslot}",
                        "what should i wear {datetimeslot} to {occasionslot}",
                        "what should i wear",
                        "what wear",
                        "yes you do"
                    ]
                },
                {
                    "name": "CheckOptions",
                    "slots": [],
                    "samples": [
                        "can you tell me my preferencces",
                        "check my preferences",
                        "check options",
                        "check preferences",
                        "did you save my preferences",
                        "preferences please",
                        "what are my current preferences",
                        "what are my preferences",
                        "what are my preferred temperatures",
                        "what are my saved options",
                        "what's my preferences"
                    ]
                },
                {
                    "name": "SubscribeToDailyUpdates",
                    "slots": [
                        {
                            "name": "datetimeslot",
                            "type": "AMAZON.DATE"
                        }
                    ],
                    "samples": [
                        "can you do this everyday",
                        "can you do this for me again {datetimeslot}",
                        "send daily updates",
                        "tell me everyday",
                        "update me daily"
                    ]
                },
                {
                    "name": "AMAZON.StopIntent",
                    "samples": []
                },
                {
                    "name": "AMAZON.NavigateHomeIntent",
                    "samples": []
                },
                {
                    "name": "LaunchRequest"
                }
            ],
            "types": [
                {
                    "name": "CONDITIONS",
                    "values": [
                        {
                            "name": {
                                "value": "hot",
                                "synonyms": [
                                    "hot",
                                    "warm",
                                    "heated",
                                    "burning"
                                ]
                            }
                        },
                        {
                            "name": {
                                "value": "comfy",
                                "synonyms": [
                                    "comfy",
                                    "moderate",
                                    "okay feeling"
                                ]
                            }
                        },
                        {
                            "name": {
                                "value": "cold",
                                "synonyms": [
                                    "cold",
                                    "chilly",
                                    "freeezing"
                                ]
                            }
                        }
                    ]
                },
                {
                    "name": "GENDER",
                    "values": [
                        {
                            "name": {
                                "value": "male",
                                "synonyms": [
                                    "male",
                                    "boy",
                                    "guy",
                                    "dude",
                                    "he",
                                    "him",
                                    "his"
                                ]
                            }
                        },
                        {
                            "name": {
                                "value": "female",
                                "synonyms": [
                                    "female",
                                    "women",
                                    "girl",
                                    "lady",
                                    "her",
                                    "she"
                                ]
                            }
                        }
                    ]
                },
                {
                    "name": "OCCASION",
                    "values": [
                        {
                            "name": {
                                "value": "formal",
                                "synonyms": [
                                    "formal",
                                    "business",
                                    "meeting",
                                    "prom",
                                    "homecoming",
                                    "dance",
                                    "ball",
                                    "funeral",
                                    "wedding"
                                ]
                            }
                        },
                        {
                            "name": {
                                "value": "business casual",
                                "synonyms": [
                                    "business casual",
                                    "work"
                                ]
                            }
                        },
                        {
                            "name": {
                                "value": "workout",
                                "synonyms": [
                                    "workout",
                                    "gym",
                                    "run",
                                    "jog",
                                    "swim",
                                    "hike"
                                ]
                            }
                        },
                        {
                            "name": {
                                "value": "lazy",
                                "synonyms": [
                                    "lazy",
                                    "home",
                                    "sleeping",
                                    "sleep in",
                                    "sleep",
                                    "relax",
                                    "hackathon"
                                ]
                            }
                        },
                        {
                            "name": {
                                "value": "casual",
                                "synonyms": [
                                    "casual",
                                    "walk",
                                    "store",
                                    "drive"
                                ]
                            }
                        }
                    ]
                }
            ]
        }
    }
};
