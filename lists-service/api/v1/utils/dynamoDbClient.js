'use strict';

const AWS = require('aws-sdk'); 

class DynamoDbClient {
    constructor(tableName) {
        this.tableName = tableName;
        this.dynamoDb = new AWS.DynamoDB.DocumentClient();
    }

    createItem(item, callback){
        const params = {
            TableName: this.tableName,
            Item: item,
        };

        console.debug("Creating item in DynamoDB: ");
        console.debug(params)

        const onPut = (err, data) => {
            if(err) {
                console.error('Could not create item in DynamoDB!')
                console.error(err);
                callback(err, null);
            } else {
                console.debug('Successfully created item in DynamoDB.')
                callback(null, item);
            }   
        }
        this.dynamoDb.put(params, onPut)
    };

    deleteItem(key, callback) {
        var params = {
            TableName: this.tableName,
            Key: key,
            ReturnValues: "ALL_OLD"
        };
    
        console.debug("Deleting item from DynamoDB: ");
        console.debug(params)
        const onDelete = (err, data) => {
            if (err) {
                console.error('Could not delete item from DynamoDB!')
                console.error(err);
                callback(err, null);
            } else {
                if (data.Attributes === undefined){
                    console.debug('Could not find item in DynamoDB')
                    callback(null, false);
                } else {
                    console.debug('Successfully deleted item in DynamoDB.')
                    callback(null, true);
                }
            }
            
        };
    
        this.dynamoDb.delete(params, onDelete);
    };

    getItem(key, callback) {
        const params = {
            TableName: this.tableName,
            Key: key
        };
        console.debug("Getting item from DynamoDB: ");
        console.debug(params);
        const onGet = (err, data) => {
            if (err) {
                console.error('Could not delete item from DynamoDB!')
                console.error(err);
                callback(err, null);
            } else {
                callback(null, data.Item)
            }
        };
        this.dynamoDb.get(params, onGet)
    };

    listItems(limit, exclusiveStartKey, callback, params={}){

        params.TableName = this.tableName;

        if (limit) {
            params.Limit = limit;
        }
        if (exclusiveStartKey) {
            params.ExclusiveStartKey = exclusiveStartKey;
        }

        console.debug("Scanning DynamoDB table: ")
        console.debug(params);
        const onScan = (err, data) => {
            if (err) {
                console.error('Could not scan DynamoDB table!')
                console.error(err);
                callback(err, null);
            } else {
                console.log("Successfully scanned DynamoDB table.");
                callback(null, data)
            }
        };

        this.dynamoDb.scan(params, onScan);
    }

    queryItems(keyConditionExpression, expressionAttributeNames, 
        expressionAttributeValues, limit, exclusiveStartKey, callback){
        var params = {
            TableName: this.tableName,
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues
        };
        if (limit) {
            params.Limit = limit;
        }
        if (exclusiveStartKey) {
            params.ExclusiveStartKey = exclusiveStartKey;
        }

        console.debug("Querying DynamoDB table: ")
        console.debug(params);
        const onQuery = (err, data) => {
            if (err) {
                console.error('Could not query DynamoDB table!')
                console.error(err);
                callback(err, null);
            } else {
                console.log("Successfully queried DynamoDB table.");
                callback(null, data);
            }
        };
        this.dynamoDb.query(params, onQuery);
    }
}

module.exports = DynamoDbClient
