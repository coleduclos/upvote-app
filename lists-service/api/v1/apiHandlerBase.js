'use strict';

const AWS = require('aws-sdk'); 
const uuid = require('uuid');

class ApiResponse {
    constructor(statusCode, body) {
        this.statusCode = statusCode;
        this.body = body;
    }
}

class ApiErrorNotFound extends ApiResponse {
    constructor() {
        super(404, JSON.stringify({'error' : 'Not found'}));
    }
}

function List(title, details, author){
    const timestamp = new Date().getTime();
    this.id = uuid.v1();
    this.title = title;
    this.details = details;
    this.createdAt = timestamp;
    this.updatedAt = timestamp;
};

class ApiHandlerBase {
    constructor(tableName) {
        this.tableName = tableName;
        this.dynamoDb = new AWS.DynamoDB.DocumentClient();
    }

    // ------- GET ALL ---------
    getAll(event, callback){
        var params = {
            TableName: this.tableName
        };
    
        console.log("Scanning lists table.");
        const onScan = (err, data) => {
            let response = new ApiResponse(500, JSON.stringify({'error' : 'internal server error'}));
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
    getOne(event, callback) {
        const id = event.pathParameters.id;
        const params = {
            TableName: this.tableName,
            Key: {
                id: id,
            },
        };
        const onGet = (err, data) => {
            let response = new ApiResponse(500, JSON.stringify({'error' : 'internal server error'}));
            if (err) {
                console.error(err);
            } else {
                if ('Item' in data) {
                    response.statusCode = 200
                    response.body = JSON.stringify(data.Item)
                } else {
                    response = new ApiErrorNotFound();
                }
            }
            callback(null, response);
        };
        this.dynamoDb.get(params, onGet)
    }

    // ------- DELETE ONE ---------
    deleteOne(event, callback) {
        const id = event.pathParameters.id;
        var params = {
            TableName: this.tableName,
            Key: {
                id: id,
            },
            ReturnValues: "ALL_OLD"
        };
    
        console.debug("Deleting list: " + id);
        const onDelete = (err, data) => {
            let response = new ApiResponse(500, JSON.stringify({'error' : 'internal server error'}));
            if (err) {
                console.error(err);
            } else {
                if (data.Attributes === undefined){
                    response = new ApiErrorNotFound()
                } else {
                    console.debug("Delete succeeded.");
                    response.statusCode = 200;
                    response.body = JSON.stringify({'message' : 'success'});
                }
            }
            callback(null, response);
        };
    
        this.dynamoDb.delete(params, onDelete);
    };

    // ------- CREATE ONE ---------
    createOne(event, callback){
        const requestBody = JSON.parse(event.body);
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
            let response = new ApiResponse(500, JSON.stringify({'error' : 'internal server error'}));
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
