'use strict';

const ApiHandlerBase = require('./apiHandlerBase.js')
const apiHandler = new ApiHandlerBase(process.env.LISTS_TABLE);

// ------- CREATE ONE ---------
module.exports.create = (event, context, callback) => {
  apiHandler.create(event, callback);
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
module.exports.delete = (event, context, callback) => {
  apiHandler.delete(event, callback);
};
