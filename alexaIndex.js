const Alexa = require('ask-sdk-core');
const axios = require('axios');
var https = require('https');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = "Hello, I am Uno. How can I help you today?";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
let x= 0;
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
  const Wear ={
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest'
        && request.intent.name === 'Wear';
    },
    async handle(handlerInput) {
      const response = await httpGet('http://dataservice.accuweather.com','/forecasts/v1/daily/5day/349291?apikey=K4BMr74M7Wj03mAhAYgLGxWtbC5rJg2U&language=en-us&details=true&metric=false');

      
      console.log(response);
      var wind = 18;
      var precipitation = false;
      var temp = 50;
      var out = "";
      if(x===0){
     out= decideAndStateOutfit('Denver','male','formal',false,50);
        x+=1;
    }
      else{
      out=  decideAndStateOutfit('Omaha','male','lazy',false,50);
        x-=1;
    }
      return handlerInput.responseBuilder
              .speak(out)
              .reprompt("Any other questions?")
              .getResponse();
    },
  };


function decideAndStateOutfit(city, gender, occasion, wind, temp) {
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

    if (!gender) {
        gender = 'female';
    }
    if (gender) {
        if (gender ==='male') {
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
            case 'Formal':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = coldFormal[Math.floor(Math.random() * coldFormal.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'Business Casual':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = coldBusinessCasual[Math.floor(Math.random() * coldBusinessCasual.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'Workout':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = coldWorkout[Math.floor(Math.random() * coldWorkout.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'Lazy':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = coldLazy[Math.floor(Math.random() * coldLazy.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'Casual':
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
            case 'Formal':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = moderateFormal[Math.floor(Math.random() * moderateFormal.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'Business Casual':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = moderateBusinessCasual[Math.floor(Math.random() * moderateBusinessCasual.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'Workout':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = moderateWorkout[Math.floor(Math.random() * moderateWorkout.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'Lazy':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = moderateLazy[Math.floor(Math.random() * moderateLazy.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'Casual':
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
            case 'Formal':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = hotFormal[Math.floor(Math.random() * hotFormal.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'Business Casual':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = hotBusinessCasual[Math.floor(Math.random() * hotBusinessCasual.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'Workout':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = hotWorkout[Math.floor(Math.random() * hotWorkout.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'Lazy':
                chosenIntro = intro[Math.floor(Math.random() * intro.length)];
                clothing = hotLazy[Math.floor(Math.random() * hotLazy.length)];
                return `${chosenIntro} ${clothing}.`;
                break;
            case 'Casual':
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
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = 'REFLECTOR_MSG'+ intentName;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = handlerInput.t('ERROR_MSG');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        
        Wear,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();