// The following code is for the Google Assistant.
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const axios = require('axios');

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const {
  dialogflow,
  RegisterUpdate,
  Suggestions,
  Permission,
} = require('actions-on-google');
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
const app = dialogflow({debug: true});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function profileSave(agent) {
    app.intent('Get Gender', (conv, {gender}) => {
      conv.data.gender = gender;
      conv.ask(`Got it!`);
      conv.ask(`What do you consider as cold?`);
      agent.add(conv);
    });
    app.intent('Get Cold Preference', (conv, {coldPref}) => {
      conv.data.coldPref = coldPref;
      conv.ask(`Got it!`);
      conv.ask(`What do you consider as moderate?`);
      agent.add(conv);
    });
    app.intent('Get Moderate Preference', (conv, {modPref}) => {
      conv.data.modPref = modPref;
      conv.ask(`Got it!`);
      conv.ask(`What do you consider as hot?`);
      agent.add(conv);
    });
    app.intent('Get Hot Preference', (conv, {hotPref}) => {
      conv.data.hotPref = hotPref;
      conv.ask(`Got it!`);
      conv.ask(`Should I remember your preferences?`);
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
}

function deletePortfolio(agent){
  app.intent('Forget Preferences', (conv) => {
      conv.user.storage = {};
      conv.ask(`Alright, I forgot your preferences.`);
        agent.add(conv);
  });
  checkPreferences();
}

function checkPreferences(agent) {
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
}

  function wear(agent) {
    checkPreferences(agent);
    if (agent.parameters.location != "") {
        geoCityToCoords(agent);
    } else {
        // TODO: ask for location permissions through google home

    }

}
function geoCityToCoords(agent) {

    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${agent.parameters.location}}&key=AIzaSyDRzIANAmqLQ3Dyl5yJzuy49oJBzlmhBQA`)
        .then((result) => {
            console.log(result);
      const lat = result.data.results[0].geometry.location.lat;
      const lng = result.data.results[0].geometry.location.lng;
            console.log(`The lattitude is ${lat}  and longitude is ${lng}`);


            getLocationIdForAccuweather(agent, agent.parameters.location, lat, lng);
        });
}
function decideAndStateOutfit(agent) {
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
                agent.add(`${chosenIntro} ${clothing}.`);
            case 'Business Casual':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = coldBusinessCasual[Math.floor(Math.random() * coldBusinessCasual.length)]
                agent.add(`${chosenIntro} ${clothing}.`);
            case 'Workout':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = coldWorkout[Math.floor(Math.random() * coldWorkout.length)]
                agent.add(`${chosenIntro} ${clothing}.`);
            case 'Lazy':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = coldLazy[Math.floor(Math.random() * coldLazy.length)]
                agent.add(`${chosenIntro} ${clothing}.`);
            case 'Casual':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = coldCasual[Math.floor(Math.random() * coldCasual.length)]
                agent.add(`${chosenIntro} ${clothing}.`);
            default:
            // do something
        }
    } else if (temp <= 68) { // Moderate


        switch (agent.parameters.occasion) {
            case 'Formal':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = moderateFormal[Math.floor(Math.random() * moderateFormal.length)]
                agent.add(`${chosenIntro} ${clothing}.`);
            case 'Business Casual':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = moderateBusinessCasual[Math.floor(Math.random() * moderateBusinessCasual.length)]
                agent.add(`${chosenIntro} ${clothing}.`);
            case 'Workout':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = moderateWorkout[Math.floor(Math.random() * moderateWorkout.length)]
                agent.add(`${chosenIntro} ${clothing}.`);
            case 'Lazy':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = moderateLazy[Math.floor(Math.random() * moderateLazy.length)]
                agent.add(`${chosenIntro} ${clothing}.`);
            case 'Casual':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = moderateCasual[Math.floor(Math.random() * moderateCasual.length)]
                agent.add(`${chosenIntro} ${clothing}.`);
            default:
                // do something
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = moderateCasual[Math.floor(Math.random() * moderateCasual.length)]
                agent.add(`${chosenIntro} ${clothing}.`);
        }
    } else { // Hot 

        switch (agent.parameters.occasion) {
            case 'Formal':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = hotFormal[Math.floor(Math.random() * hotFormal.length)]
                agent.add(`${chosenIntro} ${clothing}.`);
            case 'Business Casual':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = hotBusinessCasual[Math.floor(Math.random() * hotBusinessCasual.length)]
                agent.add(`${chosenIntro} ${clothing}.`);
            case 'Workout':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = hotWorkout[Math.floor(Math.random() * hotWorkout.length)]
                agent.add(`${chosenIntro} ${clothing}.`);
            case 'Lazy':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = hotLazy[Math.floor(Math.random() * hotLazy.length)]
                agent.add(`${chosenIntro} ${clothing}.`);
            case 'Casual':
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = hotCasual[Math.floor(Math.random() * hotCasual.length)]
                agent.add(`${chosenIntro} ${clothing}.`);
            default:
                // do something
                var chosenIntro = intro[Math.floot(Math.random() * intro.length)];
                var clothing = hotCasual[Math.floor(Math.random() * hotCasual.length)]
                agent.add(`${chosenIntro} ${clothing}.`);
        }
    }
    
    if (temp >= 32 && precipitation) { //rain
        agent.add('It\'s going to rain. Don\'t forget an rainboots and an umbrella or raincoat.');
    } else if (temp < 32 && precipitation) { //snow
        agent.add('It\'s going to snow. Don\'t forget a winter coat and boots.')
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

  function accuweather(agent, location) {
    console.log("We in yet");
    console.log(location);
    return axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${location}?apikey=NDdlL4YF9TH5LfyZGGVDNTamHJSGL1TB&language=en-us&details=true&metric=false`)
      .then((result) => {
        console.log(result.data);
        console.log("WE GOT DATA");
      })
      .catch((result) => {
        console.log("We screwed up");
      });
  }

  function getLocationIdForAccuweather(agent, name, lat, long) {
    return axios.get(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=NDdlL4YF9TH5LfyZGGVDNTamHJSGL1TB&q=${lat}%2C${long}&language=en-us&details=true&toplevel=false`)
      .then((result) => {
        console.log("WOOOT");
        console.log(result.headers['x-location-key']);
        accuweather(agent, result.headers['x-location-key'].toString());
      })
      .catch((error) => {
        console.log("We screewed up, no location :(");
        console.log(error);
      });
  }
  function setupDailyUpdates(agent) {
    agent.add(`Alright, you now have daily updates!`);
    new RegisterUpdate({
      intent: 'Wear',
      frequency: 'DAILY',
    });
  }
  function permission(agent){
    const permissions = [];
    permissions.push('DEVICE_PRECISE_LOCATION');
    const context = 'Can I know your location?';
    const options = {
      context,
      permissions,
    };
    agent.add(new Permission(options));
  }
  
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Wear', wear);
  intentMap.set('Daily Updates', setupDailyUpdates);
  
  agent.handleRequest(intentMap);
});
