'use strict';

const ApiHandlerBase = require('./apiHandlerBase.js')
const apiHandler = new ApiHandlerBase(process.env.LISTS_TABLE);

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
  apiHandler.getAll(event, callback);
};

// ------- DELETE ONE ---------
module.exports.deleteOne = (event, context, callback) => {
  apiHandler.deleteOne(event, callback);
};
