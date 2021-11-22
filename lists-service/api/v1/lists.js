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
    console.log("HELLO")
    if(err) {
      console.error(err);
      const response = new Response(500, JSON.stringify(
        {
          message: "Internal server error."
        }
      ));
      callback(null, response);
      return;

    } else {
      const response = new Response(200, data.Item);
      callback(null, response);
      return;
    }
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
    if (err) {
      console.error(err);
      callback(new Error('Could not retrieve list.'));
    } else {
      const response = new Response(500, '');
      if ('Item' in data) {
        response.statusCode = 200
        response.body = JSON.stringify(data.Item)
      } else {
        response.statusCode = 404
        response.body = JSON.stringify({'error' : 'Not found'})
      }
      callback(null, response);
    }
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
      if (err) {
          console.error('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
          callback(err);
      } else {
          console.log("Scan succeeded.");
          callback(null, {
              statusCode: 200,
              body: JSON.stringify({
                  data: data.Items
              })
          });
      }
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
      if (err) {
          console.error(err);
          const response = new Response(500, JSON.stringify(
            {
              message: "Internal server error."
            }
          ));
          callback(null, response);
      } else {
          console.log("Delete succeeded.");
          callback(null, {
              statusCode: 200,
              body: JSON.stringify({
                  message: "Success"
              })
          });
      }
  };

  dynamoDb.delete(params, onDelete);
};
