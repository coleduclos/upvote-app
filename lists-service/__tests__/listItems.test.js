const listItems = require('../api/v1/listItems');

jest.setTimeout(1000);
let mockId = 1;
let mockTitle = 'Test Title';

jest.mock("aws-sdk")

const AWS = require('aws-sdk')

test('Test getAll list items empty response w/ default limit', done => {
  AWS.DynamoDB.DocumentClient.prototype.scan.mockImplementationOnce((_, callback) => callback(null, {
    'Items' :[],
    'Count' : 0
  }));
  const exampleEvent = {'queryStringParameters' : null}
  const lambdaCallback = (err, data) => {
    try {
      expect(data.statusCode).toBe(200);
      let responseBody = JSON.parse(data.body);
      expect(responseBody.data.length).toBe(0);
      expect(responseBody.count).toBe(0);
      expect(responseBody.limit).toBe(100);
      done();
    } catch (error) {
      done(error);
    };
  };
  listItems.getAll(exampleEvent, {}, lambdaCallback)
});

test('Test getAll list items non-empty response w/ default limit', done => {
    AWS.DynamoDB.DocumentClient.prototype.scan.mockImplementationOnce((_, callback) => callback(null, {
      'Items' :[{'id' : mockId, 'title': mockTitle}],
      'Count' : 1
    }));
    const exampleEvent = {'queryStringParameters' : null}
    const lambdaCallback = (err, data) => {
      try {
        expect(data.statusCode).toBe(200);
        let responseBody = JSON.parse(data.body);
        expect(responseBody.data.length).toBe(1);
        expect(responseBody.count).toBe(1);
        expect(responseBody.limit).toBe(100);
        done();
      } catch (error) {
        done(error);
      };
    };
    listItems.getAll(exampleEvent, {}, lambdaCallback)
  });

test('Test getAll list items non-empty response w/ explicit limit & pagination', done => {
    const lastEvaluatedKey = { 'listId': mockId };
    AWS.DynamoDB.DocumentClient.prototype.scan.mockImplementationOnce((_, callback) => callback(null, {
      'Items' :[{'id' : mockId, 'title': mockTitle}],
      'Count' : 1,
      'LastEvaluatedKey': lastEvaluatedKey
    }));
    const exampleEvent = {'queryStringParameters' : {'limit':1}}
    const lambdaCallback = (err, data) => {
      try {
        expect(data.statusCode).toBe(200);
        let responseBody = JSON.parse(data.body);
        expect(responseBody.data.length).toBe(1);
        expect(responseBody.count).toBe(1);
        expect(responseBody.limit).toBe(1);
        expect(responseBody.pagination.previousCursor).toBeUndefined();
        let nextCursor = Buffer.from(responseBody.pagination.nextCursor, 'base64').toString('ascii')
        expect(nextCursor).toBe(JSON.stringify(lastEvaluatedKey));
        done();
      } catch (error) {
        done(error);
      };
    };
    listItems.getAll(exampleEvent, {}, lambdaCallback)
  });

test('Test list item not found', done => {
    AWS.DynamoDB.DocumentClient.prototype.get.mockImplementationOnce((_, callback) => callback(null, {}));
    const exampleEvent = {'pathParameters' : {'listId' : mockId, 'itemId' : mockId}}
    const lambdaCallback = (err, data) => {
      try {
        console.log(data)
        expect(data.statusCode).toBe(404);
        done();
      } catch (error) {
        done(error);
      };
    };
    listItems.getOne(exampleEvent, {}, lambdaCallback)
  });

test('Test get valid list item', done => {
    AWS.DynamoDB.DocumentClient.prototype.get.mockImplementationOnce((_, callback) => callback(null, {'Item' : {
      'itemId' : mockId,
      'listId' : mockId,
      'title': mockTitle
    }}));
    const exampleEvent = {'pathParameters' : {'listId' : mockId, 'itemId' : mockId}}
    const lambdaCallback = (err, data) => {
      try {
        let responseBody = JSON.parse(data.body);
        expect(data.statusCode).toBe(200);
        expect(responseBody.itemId).toBe(mockId);
        expect(responseBody.listId).toBe(mockId);
        expect(responseBody.title).toBe(mockTitle);
        done();
      } catch (error) {
        done(error);
      };
    };
    listItems.getOne(exampleEvent, {}, lambdaCallback)
  });

test('Test create valid list item', done => {
    AWS.DynamoDB.DocumentClient.prototype.put.mockImplementationOnce((_, callback) => callback(null, {'Item': {'title': mockTitle}}));
    const exampleEvent = {
      'body' : '{\"title\":\"'+mockTitle+'\",\"details\":\"test details\"}',
      'pathParameters' : {'listId' : mockId}
    }
    const lambdaCallback = (err, data) => {
      try {
        let responseBody = JSON.parse(data.body);
        expect(data.statusCode).toBe(200);
        expect(responseBody.title).toBe(mockTitle);
        done();
      } catch (error) {
        done(error);
      };
    };
    listItems.createOne(exampleEvent, {}, lambdaCallback)
  });

  test('Test delete valid list item', done => {
    AWS.DynamoDB.DocumentClient.prototype.delete.mockImplementationOnce((_, callback) => callback(null, {'Attributes': {'title': mockTitle}}));
    const exampleEvent = {'pathParameters' : {'listId' : mockId, 'itemId' : mockId}}
    const lambdaCallback = (err, data) => {
      try {
        expect(data.statusCode).toBe(200);
        done();
      } catch (error) {
        done(error);
      };
    };
    listItems.deleteOne(exampleEvent, {}, lambdaCallback)
  });

  test('Test delete list item not found', done => {
    AWS.DynamoDB.DocumentClient.prototype.delete.mockImplementationOnce((_, callback) => callback(null, {}));
    const exampleEvent = {'pathParameters' : {'listId' : mockId, 'itemId' : mockId}}
    const lambdaCallback = (err, data) => {
      try {
        expect(data.statusCode).toBe(404);
        done();
      } catch (error) {
        done(error);
      };
    };
    listItems.deleteOne(exampleEvent, {}, lambdaCallback)
  });