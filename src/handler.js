import BitmovinThumbnailImageLambda from './BitmovinThumbnailImageLambda';
'use strict';
require('dotenv').config();
const jf = require('jsonfile');

function processMessage(event) {
  let message = event.body
  message = JSON.parse(message)
  return message;
}

function entry(event, context, callback) {
  const bit = new BitmovinThumbnailImageLambda();
  const message = processMessage(event);
  return bit.start(message)
    .then((result) => {
      console.log('Successfully transferred thumbnail', result);
      let message = {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: "Success, " + JSON.stringify(result)
      }
      callback(null, message)
    })
    .catch((error) =>{
      console.log("ERROR failed to transfer thumbnail to S3", error);
      let message = {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json"
        },
        body: "Error, " + JSON.stringify(error)
      }
      callback(null, message)
    }
  );
}

function test() {
  const bit = new BitmovinThumbnailImageLambda();
  const event = jf.readFileSync('event.json');
  const message = processMessage(event);
   return bit.start(message)
    .then((result) => {
      console.log('Successfully transferred thumbnail', result);
      let message = {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: "Success, " + JSON.stringify(result)
      }
      callback(null, message)
    })
    .catch((error) =>{
      console.log("ERROR failed to transfer thumbnail to S3", error);
      let message = {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json"
        },
        body: "Error, " + JSON.stringify(error)
      }
      callback(null, message)
    }
  );
}

module.exports = {
  entry,
  test,
};
