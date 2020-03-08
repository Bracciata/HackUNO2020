'use strict';

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

exports.yourAction = functions.https.onRequest(app);