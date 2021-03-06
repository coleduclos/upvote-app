'use strict';
const uuid = require('uuid');
const api = require('./utils/api.js')
const auth = require('./utils/auth.js')

const DynamoDbClient = require('./utils/dynamoDbClient.js')

function ListItem(listId, title, details, createdBy, updatedBy){
  const timestamp = new Date().getTime();
  this.itemId = uuid.v1();
  this.listId = listId;
  this.title = title;
  this.details = details;
  this.createdAt = timestamp;
  this.createdBy = createdBy;
  this.updatedAt = timestamp;
  this.updatedBy = updatedBy;
};

class ListItemsDbClient {
  constructor(){
    this.dbClient = new DynamoDbClient(process.env.LIST_ITEMS_TABLE)
  }
  createOne(listId, title, details, userId, callback){
    const item = new ListItem(listId, title, details, userId, userId)
    this.dbClient.createItem(item, callback);
  }
  deleteOne(listId, itemId, callback){
    const key = { 
      'listId' : listId,
      'itemId' : itemId
    };
    this.dbClient.deleteItem(key, callback);
  }
  getOne(listId, itemId, callback){
    const key = { 
      'listId' : listId,
      'itemId' : itemId
    };
    this.dbClient.getItem(key, callback);
  }
  getAllByListId(listId, limit, nextCursor, callback, params={}){
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
    params.ExpressionAttributeNames["#keyName"] = "listId"
    params.ExpressionAttributeValues[":keyValue"] = listId
    this.dbClient.queryItems(params, limit, exclusiveStartKey, callback);
  }
}

class ListItemsApiHandler {
  constructor(){
    this.apiResultsDefaultLimit = process.env.API_RESULTS_DEFAULT_LIMIT || 100;
    this.dbClient = new ListItemsDbClient();
  }
  createOne(event, userId, callback){
    const requestBody = JSON.parse(event.body);
    const listId = event.pathParameters.listId;
    const title = requestBody.title;
    const details = requestBody.details;
    const author = requestBody.author;
    // TODO: validate request
    console.debug('Validating request...');
    this.dbClient.createOne(listId, title, details, userId, function(err, data){
      api.createOneCallback(err, data, callback);
    })
  }
  getAllByListId(event, callback){
    const listId = event.pathParameters.listId;
    let limit = this.apiResultsDefaultLimit;
    let nextCursor = null;
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
      // Create filter from remaining query string params
      if( Object.keys(event.queryStringParameters).length !== 0){
        params = api.generateFilterExpression(event.queryStringParameters);
      }
    }
    this.dbClient.getAllByListId(listId, limit, nextCursor, function(err, data){
      api.getAllCallback(err, data, limit, nextCursor, callback)
    }, params=params)
  }
  getOne(event, callback){
    const listId = event.pathParameters.listId;
    const itemId = event.pathParameters.itemId;
    this.dbClient.getOne(listId, itemId, function(err, data){
      api.getOneCallback(err, data, callback)
    });
  }
  deleteOne(event, userId, callback){
    const listId = event.pathParameters.listId;
    const itemId = event.pathParameters.itemId;
    this.dbClient.deleteOne(listId, itemId, function(err, data){
      api.deleteOneCallback(err, data, callback)
    });
  } 
}

const apiHandler = new ListItemsApiHandler();

// ------- CREATE ONE ---------
module.exports.createOne = (event, context, callback) => {
  auth.getUserIdFromRequest(event, function(err, userId) {
    if (err) {
      callback(null, new api.ApiErrorUnableToFindUser());
    } else {
      apiHandler.createOne(event, userId, callback);
    }
  });
};

// ------- GET ONE ---------
module.exports.getOne = (event, context, callback) => {
  apiHandler.getOne(event, callback);
};

// ------- GET ALL ---------
module.exports.getAllByListId = (event, context, callback) => {
  apiHandler.getAllByListId(event, callback);
};

// ------- DELETE ONE ---------
module.exports.deleteOne = (event, context, callback) => {
  apiHandler.deleteOne(event, "", callback);
};
