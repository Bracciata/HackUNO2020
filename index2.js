'use strict';
const axios = require('axios');

const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');

const app = dialogflow({debug: true});

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
  app.intent('Wear', (conv, {"geo-city":city}) => {
    console.log(`City is ${city}`);
    if (conv.arguments.get(city) != "") {
        geoCityToCoords(conv,city);
    } else {
        // TODO: ask for location permissions through google home
        permissionChecker(conv);
    }
  });
  function geoCityToCoords(conv,city) {

    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}}&key=AIzaSyDRzIANAmqLQ3Dyl5yJzuy49oJBzlmhBQA`)
        .then((result) => {
            console.log(result);
            const lat = result.data.results[0].geometry.location.lat;
            const lng = result.data.results[0].geometry.location.lng;
            console.log(`The lattitude is ${lat}  and longitude is ${lng}`);
            getLocationIdForAccuweather(conv, city, lat, lng);
        });
}
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
