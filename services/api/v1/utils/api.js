'use strict';

class ApiResponse {
    constructor(statusCode, body, cors=true) {
        this.statusCode = statusCode;
        this.body = body;
        if(cors) {
            this.headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            }
        }
    }
}

class ApiErrorNotFound extends ApiResponse {
    constructor() {
        super(404, JSON.stringify({'error' : 'Not found'}));
    }
}

class ApiErrorUnableToFindUser extends ApiResponse {
    constructor() {
        super(401, JSON.stringify({'error' : 'Could not find user'}));
    }
}

class ApiErrorUnauthorized extends ApiResponse {
    constructor() {
        super(401, JSON.stringify({'error' : 'Unauthorized'}));
    }
}

function createOneCallback(err, data, callback){
    let response = new ApiResponse(500, JSON.stringify({'error' : 'internal server error'}));
    if(err) {
        console.error(err);
    } else {
        response.statusCode = 200;
        response.body = JSON.stringify(data);
    }
    callback(null, response);
}

function deleteOneCallback(err, data, callback) {
    let response = new ApiResponse(500, JSON.stringify({'error' : 'internal server error'}));
    if (err) {
        console.error(err);
    } else {
        if (data){
            console.debug("Successfully deleted item.");
            response.statusCode = 200;
            response.body = JSON.stringify({'message' : 'success'});
        } else {
            response = new ApiErrorNotFound()
        }
    }
    callback(null, response);
}

function getAllCallback(err, data, limit, nextCursor, callback){
    let response = new ApiResponse(500, JSON.stringify({'error' : 'internal server error'}));
    if (err) {
        console.error(err);
    } else {
        console.log("Scan succeeded.");
        response.statusCode = 200;
        response.body = generateListResponseBody(data, limit, nextCursor);
    }
    callback(null, response);
}

function getOneCallback(err, data, callback){
    let response = new ApiResponse(500, JSON.stringify({'error' : 'internal server error'}));
    if (err) {
        console.error(err);
    } else {
        if (data) {
            console.debug("Successfully retrieved item.")
            response.statusCode = 200
            response.body = JSON.stringify(data)
        } else {
            response = new ApiErrorNotFound();
        }
    }
    callback(null, response);
}

function generateListResponseBody(data, limit, previousCursor){
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

function generateFilterExpression(queryStringParameters,
    expressionAttributeNames={},
    expressionAttributeValues={}){

    let filterExpression = "";
    for (const property in queryStringParameters) {
        filterExpression += ` #${property} = :${property} ,`;
        expressionAttributeNames["#" + property] = property;
        expressionAttributeValues[":" + property] = queryStringParameters[property];
    }

    filterExpression = filterExpression.slice(0, -1);

    const params = {
        FilterExpression : filterExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
    }
    return params
}

module.exports = {
    ApiResponse, 
    ApiErrorNotFound,
    ApiErrorUnableToFindUser,
    ApiErrorUnauthorized,
    createOneCallback,
    deleteOneCallback,
    getAllCallback,
    getOneCallback,
    generateFilterExpression
}