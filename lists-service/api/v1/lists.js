'use strict';
const uuid = require('uuid');
const api = require('./utils/api.js')
const auth = require('./utils/auth.js')

const DynamoDbClient = require('./utils/dynamoDbClient.js')

function List(title, details, createdBy){
  const timestamp = new Date().getTime();
  this.listId = uuid.v1();
  this.title = title;
  this.details = details;
  this.createdAt = timestamp;
  this.updatedAt = timestamp;
  this.createdBy = createdBy;
};

class ListsDbClient {
  constructor(){
    this.dbClient = new DynamoDbClient(process.env.LISTS_TABLE)
  }
  createOne(title, details, createdBy, callback){
    const item = new List(title, details, createdBy)
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
  getAll(limit, nextCursor, callback){
    let exclusiveStartKey = null;
    if (nextCursor) {
      exclusiveStartKey = JSON.parse(Buffer.from(nextCursor, 'base64').toString('ascii'));
    }
    this.dbClient.listItems(limit, exclusiveStartKey, callback);
  }
}

class ListsApiHandler {
  constructor(){
    this.apiResultsDefaultLimit = process.env.API_RESULTS_DEFAULT_LIMIT || 100;
    this.dbClient = new ListsDbClient();
  }

  createOne(event, userId, callback){
    const requestBody = JSON.parse(event.body);
    const title = requestBody.title;
    const details = requestBody.details;
    // TODO: validate request
    console.debug('Validating request...');
    this.dbClient.createOne(title, details, userId, function(err, data){
      api.createOneCallback(err, data, callback);
    })
  }
  getAll(event, callback){
    let limit = this.apiResultsDefaultLimit;
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
    this.dbClient.getAll(limit, nextCursor, function(err, data){
      api.getAllCallback(err, data, limit, nextCursor, callback)
    })
  }
  getOne(event, callback){
    const listId = event.pathParameters.listId;
    this.dbClient.getOne(listId, function(err, data){
      api.getOneCallback(err, data, callback)
    });
  }
  deleteOne(event, userId, callback){
    const listId = event.pathParameters.listId;
    this.dbClient.deleteOne(listId, function(err, data){
      api.deleteOneCallback(err, data, callback)
    });
  } 
}

const apiHandler = new ListsApiHandler(process.env.LISTS_TABLE);

// ------- CREATE ONE ---------
module.exports.createOne = (event, context, callback) => {
  auth.getUserIdFromRequest(event, function(err, userId) {
    apiHandler.createOne(event, userId, callback);
  });
};

// ------- GET ONE ---------
module.exports.getOne = (event, context, callback) => {
  apiHandler.getOne(event, callback);
};

// ------- GET ALL ---------
module.exports.getAll = (event, context, callback) => {
  console.log(event)
  console.log(context)
  apiHandler.getAll(event, callback);
};

// ------- DELETE ONE ---------
module.exports.deleteOne = (event, context, callback) => {
  // auth.getUserIdFromRequest(event, function(err, userId) {
    apiHandler.deleteOne(event, "", callback);
  // });
};
