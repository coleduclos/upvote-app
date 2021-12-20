'use strict';
const uuid = require('uuid');


const ApiHandlerBase = require('./apiHandlerBase.js')
const utils = require('./utils.js')

function Vote(userId, listId, itemId, score){
  const timestamp = new Date().getTime();
  this.voteId = uuid.v1();
  this.userId = userId;
  this.listId_itemId = listId + "_" + itemId;
  this.listId = listId;
  this.itemId = itemId;
  this.score = score;
  this.createdAt = timestamp;
  this.updatedAt = timestamp;
};

class VotesApiHandler extends ApiHandlerBase {
  createOne(event, userId, callback){
    console.log('USER ID: ' + userId)
    const requestBody = JSON.parse(event.body);
    const listId = requestBody.listId;
    const itemId = requestBody.itemId;
    const score = requestBody.score;
    // TODO: validate request
    console.debug('Validating vote...');
    const item = new Vote(userId, listId, itemId, score)
    super.createOne(item, callback)
  }
  getAll(event, callback){
    let limit = this.resultsDefaultLimit;
    let nextCursor = null;
    if (event.queryStringParameters){
      if ('limit' in event.queryStringParameters)
      {
        limit = event.queryStringParameters.limit;
      }
      if ('nextCursor' in event.queryStringParameters){
        nextCursor = event.queryStringParameters.nextCursor;
      }
    }

    super.getAll(callback, limit=limit, nextCursor=nextCursor)
  }
  getOne(event, callback){
    const key = { 'listId' : event.pathParameters.listId };
    super.getOne(key, callback)
  }
  deleteOne(event, callback){
    const key = { 'listId' : event.pathParameters.listId };
    super.deleteOne(key, callback)
  } 
}

const apiHandler = new VotesApiHandler(process.env.VOTES_TABLE);

// ------- CREATE ONE ---------
module.exports.createOne = (event, context, callback) => {
  utils.getUserIdFromRequest(event, function(err, userId) {
    apiHandler.createOne(event, userId, callback);
  })
};

// ------- GET ONE ---------
module.exports.getOne = (event, context, callback) => {
  apiHandler.getOne(event, callback);
};

// ------- GET ALL ---------
module.exports.getAll = (event, context, callback) => {
  console.log(event)
  apiHandler.getAll(event, callback);
};

// ------- DELETE ONE ---------
module.exports.deleteOne = (event, context, callback) => {
  apiHandler.deleteOne(event, callback);
};
