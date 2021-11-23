'use strict';

const AWS = require('aws-sdk'); 
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

function Response(statusCode, body) {
  this.statusCode = statusCode;
  this.body = body;
}

function List(title, details, author){
  const timestamp = new Date().getTime();
  this.id = uuid.v1()
  this.title = title
  this.details = details
  this.createdAt = timestamp
  this.updatedAt = timestamp
};

// ------- CREATE ONE ---------
module.exports.create = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const title = requestBody.title;
  const details = requestBody.details;
  const author = requestBody.author;

  // TODO: validate body
  console.log('Validating list...');
  if (typeof title !== 'string' || typeof details !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit list because of validation errors.'));
    return;
  }

  console.log('Creating list...');
  const list = new List(title, details, author)

  const onPut = (err, data) => {
    const response = new Response(500, JSON.stringify({'error' : 'internal server error'}));
    if(err) {
      console.error(err);
      callback(null, response);
    } else {
      response.statusCode = 200;
      response.body = JSON.stringify(list);
    }
    callback(null, response);
  }

  const listInfo = {
    TableName: process.env.LISTS_TABLE,
    Item: list,
  };

  dynamoDb.put(listInfo, onPut)
};

// ------- GET ONE ---------
module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.LISTS_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  const onGet = (err, data) => {
    const response = new Response(500, JSON.stringify({'error' : 'internal server error'}));
    if (err) {
      console.error(err);
    } else {
      if ('Item' in data) {
        response.statusCode = 200
        response.body = JSON.stringify(data.Item)
      } else {
        response.statusCode = 404
        response.body = JSON.stringify({'error' : 'Not found'})
      }
    }
    callback(null, response);
  };

  dynamoDb.get(params, onGet)
};

// ------- GET ALL ---------
module.exports.getAll = (event, context, callback) => {
  var params = {
      TableName: process.env.LISTS_TABLE,
      ProjectionExpression: "id, title"
  };

  console.log("Scanning lists table.");
  const onScan = (err, data) => {
      console.log("GET ALL RESPONSE" + data)
      const response = new Response(500, JSON.stringify({'error' : 'internal server error'}));
      if (err) {
          console.error(err);
        } else {
          console.log("Scan succeeded.");
          response.statusCode = 200;
          response.body = JSON.stringify(data.Items);
      }
      callback(null, response);
  };
  
  dynamoDb.scan(params, onScan);
};

// ------- DELETE ONE ---------
module.exports.delete = (event, context, callback) => {
  var params = {
      TableName: process.env.LISTS_TABLE,
      Key: {
        id: event.pathParameters.id,
      },
  };

  console.log("Deleting list: " + event.pathParameters.id);
  const onDelete = (err, data) => {
      const response = new Response(500, JSON.stringify({'error' : 'internal server error'}));
      if (err) {
          console.error(err);
      } else {
          console.log("Delete succeeded.");
          response.statusCode = 200;
          response.body = JSON.stringify({'message' : 'success'});
      }
      callback(null, response);
  };

  dynamoDb.delete(params, onDelete);
};
