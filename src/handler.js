import BitmovinThumbnailImageLambda from './BitmovinThumbnailImageLambda';
'use strict';
require('dotenv').config();
const jf = require('jsonfile');

function processMessage(event) {
  let message = event.body
  message = JSON.parse(message)
  return message;
}

async function entry(event, context, callback) {
  let response = {};
  try{
    const bit = new BitmovinThumbnailImageLambda();
    const message = processMessage(event);
    const createThumbnail = await bit.start(message);
    console.log('Successfully transferred thumbnail', createThumbnail);
    response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: "Success, " + JSON.stringify(createThumbnail)
    }
    
  }catch(error){
    console.log("ERROR failed to transfer thumbnail to S3", error);
    response = {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json"
        },
        body: "Error, " + JSON.stringify(error)
      }
  }
  callback(null, response)
}

async function test(realEvent, context, callback) {
  let response = {};
  try{
    const bit = new BitmovinThumbnailImageLambda();
    const event = jf.readFileSync('event.json');
    const message = processMessage(event);
    const createThumbnail = await bit.start(message);
    console.log('Successfully transferred thumbnail', createThumbnail);
    response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: "Success, " + JSON.stringify(createThumbnail)
    }
    
  }catch(error){
    console.log("ERROR failed to transfer thumbnail to S3", error);
    response = {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json"
        },
        body: "Error, " + JSON.stringify(error)
      }
  }
  callback(null, response)
}

module.exports = {
  entry,
  test,
};
