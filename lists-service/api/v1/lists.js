'use strict';
const uuid = require('uuid');


const ApiHandlerBase = require('./apiHandlerBase.js')

function List(title, details, author){
  const timestamp = new Date().getTime();
  this.listId = uuid.v1();
  this.title = title;
  this.details = details;
  this.createdAt = timestamp;
  this.updatedAt = timestamp;
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
  apiHandler.getAll(callback);
};

// ------- DELETE ONE ---------
module.exports.deleteOne = (event, context, callback) => {
  apiHandler.deleteOne(event, callback);
};
