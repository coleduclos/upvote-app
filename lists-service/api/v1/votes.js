'use strict';
const uuid = require('uuid');

const api = require('./utils/api.js')
const auth = require('./utils/auth.js')

const DynamoDbClient = require('./utils/dynamoDbClient.js')

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

class VotesDbClient {
  constructor(){
    this.dbClient = new DynamoDbClient(process.env.VOTES_TABLE)
  }
  createOne(userId, listId, itemId, score, callback){
    const item = new Vote(userId, listId, itemId, score)
    this.dbClient.createItem(item, callback)
  }
  deleteOne(listId, callback){
    const key = { 'listId' : listId };
    this.dbClient.deleteItem(key, callback)
  }
  getOne(listId, callback){
    const key = { 'listId' : listId };
    this.dbClient.getItem(key, callback)
  }
  getAll(limit, nextCursor, callback, params={}){
    let exclusiveStartKey = null;
    if (nextCursor) {
      exclusiveStartKey = JSON.parse(Buffer.from(nextCursor, 'base64').toString('ascii'));
    }
    this.dbClient.listItems(limit, exclusiveStartKey, callback, params=params);
  }
  getAllByUserId(userId, limit, nextCursor, callback, params={}){
    let exclusiveStartKey = null;
    if (nextCursor) {
      exclusiveStartKey = JSON.parse(Buffer.from(nextCursor, 'base64').toString('ascii'));
    }
    params.KeyConditionExpression = "#keyName = :keyValue";
    if (!('ExpressionAttributeNames' in params)) {
      params.ExpressionAttributeNames = {}
    }
    if (!('ExpressionAttributeValues' in params)) {
      params.ExpressionAttributeValues = {}
    }
    params.ExpressionAttributeNames["#keyName"] = "userId"
    params.ExpressionAttributeValues[":keyValue"] = userId
    this.dbClient.queryItems(params, limit, exclusiveStartKey, callback);
  }
}

class VotesApiHandler {
  constructor(){
    this.apiResultsDefaultLimit = process.env.API_RESULTS_DEFAULT_LIMIT || 100;
    this.dbClient = new VotesDbClient();
  }
  createOne(event, userId, callback){
    const requestBody = JSON.parse(event.body);
    const listId = requestBody.listId;
    const itemId = requestBody.itemId;
    const score = requestBody.score;
    // TODO: validate request
    console.debug('Validating request...');
    this.dbClient.createOne(userId, listId, itemId, score, function(err, data){
      api.createOneCallback(err, data, callback);
    })
  }
  getAll(event, callback){
    let limit = this.apiResultsDefaultLimit;
    let nextCursor = null;
    let queryStringParamUserId = null;
    let params = {};
    if (event.queryStringParameters){
      if ('limit' in event.queryStringParameters)
      {
        limit = event.queryStringParameters.limit;
        delete event.queryStringParameters.limit;
      }
      if ('nextCursor' in event.queryStringParameters){
        nextCursor = event.queryStringParameters.nextCursor;
        delete event.queryStringParameters.nextCursor;
      }
      // Need to remove userId from filtered expression b/c its a key
      if ('userId' in event.queryStringParameters){
        queryStringParamUserId = event.queryStringParameters.userId;
        delete event.queryStringParameters.userId;
      }
      // Create filter from remaining query string params
      if( Object.keys(event.queryStringParameters).length !== 0){
        params = api.generateFilterExpression(event.queryStringParameters);
      }
    }
    // If user id present in query params, optimize the query
    if (queryStringParamUserId){
      this.dbClient.getAllByUserId(queryStringParamUserId,
        limit, nextCursor, function(err, data){
        api.getAllCallback(err, data, limit, nextCursor, callback)
      }, params=params)
    }
    else {
      this.dbClient.getAll(limit, nextCursor, function(err, data){
        api.getAllCallback(err, data, limit, nextCursor, callback)
      }, params=params)
    }
  }
  getOne(event, callback){
    const listId = event.pathParameters.listId;
    this.dbClient.getOne(listId, function(err, data){
      api.getOneCallback(err, data, callback)
    });
  }
  deleteOne(event, callback){
    const listId = event.pathParameters.listId;
    this.dbClient.deleteOne(listId, function(err, data){
      api.deleteOneCallback(err, data, callback)
    });
  } 
}

const apiHandler = new VotesApiHandler();

// ------- CREATE ONE ---------
module.exports.createOne = (event, context, callback) => {
  auth.getUserIdFromRequest(event, function(err, userId) {
    apiHandler.createOne(event, userId, callback);
  })
};

// ------- GET ONE ---------
module.exports.getOne = (event, context, callback) => {
  apiHandler.getOne(event, callback);
};

// ------- GET ALL ---------
module.exports.getAll = (event, context, callback) => {
  apiHandler.getAll(event, callback);
};

// ------- DELETE ONE ---------
module.exports.deleteOne = (event, context, callback) => {
  apiHandler.deleteOne(event, callback);
};
