'use strict';

const ApiHandlerBase = require('./apiHandlerBase.js')
const apiHandler = new ApiHandlerBase(process.env.LISTS_TABLE);

// ------- CREATE ONE ---------
module.exports.create = (event, context, callback) => {
  apiHandler.create(event.body, callback);
};

// ------- GET ONE ---------
module.exports.getOne = (event, context, callback) => {
  apiHandler.getOne(event.pathParameters.id, callback);
};

// ------- GET ALL ---------
module.exports.getAll = (event, context, callback) => {
  apiHandler.getAll(callback);
};

// ------- DELETE ONE ---------
module.exports.delete = (event, context, callback) => {
  apiHandler.delete(event.pathParameters.id, callback);
};
