'use strict';
const uuid = require('uuid');


const ApiHandlerBase = require('./apiHandlerBase.js')

function List(title, details, createdBy){
  const timestamp = new Date().getTime();
  this.listId = uuid.v1();
  this.title = title;
  this.details = details;
  this.createdAt = timestamp;
  this.updatedAt = timestamp;
  this.createdBy = createdBy;
};

class ListsApiHandler extends ApiHandlerBase {
  createOne(event, callback){
    const requestBody = JSON.parse(event.body);
    const title = requestBody.title;
    const details = requestBody.details;
    const author = requestBody.author;
    // TODO: validate request
    console.debug('Validating list...');
    const item = new List(title, details, author)
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

const apiHandler = new ListsApiHandler(process.env.LISTS_TABLE);

// ------- CREATE ONE ---------
module.exports.createOne = (event, context, callback) => {
  apiHandler.createOne(event, callback);
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
  apiHandler.deleteOne(event, callback);
};
