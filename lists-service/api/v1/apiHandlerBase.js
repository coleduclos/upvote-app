'use strict';

const AWS = require('aws-sdk'); 

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

class ApiHandlerBase {
    constructor(tableName) {
        this.tableName = tableName;
        this.dynamoDb = new AWS.DynamoDB.DocumentClient();
        this.resultsDefaultLimit = process.env.API_RESULTS_DEFAULT_LIMIT || 100;
    }

    generateListResponseBody(data, limit, previousCursor){
        const responseBody = {
            'count' : data.Count,
            'limit' : limit,
            'data' : data.Items,
            'pagination' : {
                'previousCursor' : previousCursor,
                'nextCursor': null
            }
        }
        if (data.LastEvaluatedKey) {
            // Set nextCursor
            const nextCursor = Buffer.from(JSON.stringify(data.LastEvaluatedKey)).toString('base64');
            responseBody.pagination.nextCursor = nextCursor;
        }
        return JSON.stringify(responseBody)
    }
    // ------- GET ALL ---------
    getAllByForeignKey(foreignKey, foreignKeyValue, callback, limit=this.resultsDefaultLimit, nextCursor=null){
        var params = {
            TableName: this.tableName,
            Limit: limit,
            KeyConditionExpression: "#fk = :fv",
            ExpressionAttributeNames: {
                "#fk": foreignKey
            },
            ExpressionAttributeValues: {
                ":fv": foreignKeyValue
            }
        };

        if (nextCursor) {
            params.ExclusiveStartKey = JSON.parse(Buffer.from(nextCursor, 'base64').toString('ascii'));
        }

        console.log("Querying table: " + this.tableName);
        const onQuery = (err, data) => {
            let response = new ApiResponse(500, JSON.stringify({'error' : 'internal server error'}));
            if (err) {
                console.error(err);
            } else {
                console.log("Scan succeeded.");
                response.statusCode = 200;
                response.body = this.generateListResponseBody(data, limit, nextCursor);
            }
            callback(null, response);
        };

        this.dynamoDb.query(params, onQuery);
    };

    // ------- GET ALL ---------
    getAll(callback, limit=this.resultsDefaultLimit, nextCursor=null){
        var params = {
            TableName: this.tableName,
            Limit: limit
        };

        if (nextCursor) {
            params.ExclusiveStartKey = JSON.parse(Buffer.from(nextCursor, 'base64').toString('ascii'));
        }

        console.log("Scanning table: " + this.tableName);
        const onScan = (err, data) => {
            let response = new ApiResponse(500, JSON.stringify({'error' : 'internal server error'}));
            if (err) {
                console.error(err);
            } else {
                console.log("Scan succeeded.");
                response.statusCode = 200;
                response.body = this.generateListResponseBody(data, limit, nextCursor);
            }
            callback(null, response);
        };

        this.dynamoDb.scan(params, onScan);
    };

    // ------- GET ONE ---------
    getOne(key, callback) {
        const params = {
            TableName: this.tableName,
            Key: key
        };
        console.debug("Getting item: " + key);
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
    deleteOne(key, callback) {
        var params = {
            TableName: this.tableName,
            Key: key,
            ReturnValues: "ALL_OLD"
        };
    
        console.debug("Deleting item: " + key);
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
    createOne(item, callback){
        const params = {
            TableName: this.tableName,
            Item: item,
        };
        const onPut = (err, data) => {
            let response = new ApiResponse(500, JSON.stringify({'error' : 'internal server error'}));
            if(err) {
                console.error(err);
                callback(null, response);
            } else {
                response.statusCode = 200;
                response.body = JSON.stringify(item);
            }
            callback(null, response);
        }

        this.dynamoDb.put(params, onPut)
    };

}

module.exports = ApiHandlerBase
