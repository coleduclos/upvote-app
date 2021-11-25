'use strict';

const AWS = require('aws-sdk'); 
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

class ApiHandlerBase {
    constructor(tableName) {
        this.tableName = tableName;
        this.dynamoDb = new AWS.DynamoDB.DocumentClient();
    }
    // ------- GET ALL ---------
    getAll(callback){
        var params = {
            TableName: this.tableName
        };
    
        console.log("Scanning lists table.");
        const onScan = (err, data) => {
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
        
        this.dynamoDb.scan(params, onScan);
    };
    // ------- GET ONE ---------
    getOne(id, callback) {

        const params = {
            TableName: this.tableName,
            Key: {
                id: id,
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
        this.dynamoDb.get(params, onGet)
    }

    // ------- DELETE ONE ---------
    delete(id, callback) {
        var params = {
            TableName: this.tableName,
            Key: {
                id: id,
            },
        };
    
        console.debug("Deleting list: " + id);
        const onDelete = (err, data) => {
            const response = new Response(500, JSON.stringify({'error' : 'internal server error'}));
            if (err) {
                console.error(err);
            } else {
                console.debug("Delete succeeded.");
                response.statusCode = 200;
                response.body = JSON.stringify({'message' : 'success'});
            }
            callback(null, response);
        };
    
        this.dynamoDb.delete(params, onDelete);
    };

    // ------- CREATE ONE ---------
    create(body, callback){
        const requestBody = JSON.parse(body);
        const title = requestBody.title;
        const details = requestBody.details;
        const author = requestBody.author;
    
        // TODO: validate body
        console.log('Validating list...');
    
        console.log('Creating list...');
        const list = new List(title, details, author)

        const params = {
            TableName: this.tableName,
            Item: list,
        };

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

        this.dynamoDb.put(params, onPut)
    };
  
}

module.exports = ApiHandlerBase
