const lists = require('../api/v1/lists');

jest.setTimeout(1000);
let mockId = '0';
let mockUserId = '1';
let mockTitle = 'Test Title';

jest.mock("aws-sdk")
jest.mock('../api/v1/utils/auth.js', () => {
    return {
      getUserIdFromRequest: jest.fn().mockImplementationOnce((_, callback) => callback(null, mockUserId))
    };
});

const AWS = require('aws-sdk')

test('Test getAll lists empty response w/ default limit', done => {
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
  lists.getAll(exampleEvent, {}, lambdaCallback)
});

test('Test getAll lists non-empty response w/ default limit', done => {
    AWS.DynamoDB.DocumentClient.prototype.scan.mockImplementationOnce((_, callback) => callback(null, {
      'Items' :[{'listId' : mockId, 'title': mockTitle}],
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
    lists.getAll(exampleEvent, {}, lambdaCallback)
  });

test('Test getAll lists non-empty response w/ explicit limit & pagination', done => {
    const lastEvaluatedKey = { 'listId': mockId };
    AWS.DynamoDB.DocumentClient.prototype.scan.mockImplementationOnce((_, callback) => callback(null, {
      'Items' :[{'listId' : mockId, 'title': mockTitle}],
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
        expect(responseBody.pagination.previousCursor).toBeNull();
        let nextCursor = Buffer.from(responseBody.pagination.nextCursor, 'base64').toString('ascii')
        expect(nextCursor).toBe(JSON.stringify(lastEvaluatedKey));
        done();
      } catch (error) {
        done(error);
      };
    };
    lists.getAll(exampleEvent, {}, lambdaCallback)
  });

test('Test getAll lists non-empty response w/ filtering, explicit limit, & pagination', done => {
  const lastEvaluatedKey = { 'listId': mockId };
  AWS.DynamoDB.DocumentClient.prototype.scan.mockImplementationOnce((_, callback) => callback(null, {
    'Items' :[{'listId' : mockId, 'title': mockTitle, 'createdBy' : mockUserId}],
    'Count' : 1,
    'LastEvaluatedKey': lastEvaluatedKey
  }));
  const exampleEvent = {'queryStringParameters' : {'limit':1, 'createdBy' : mockUserId}}
  const lambdaCallback = (err, data) => {
    try {
      expect(data.statusCode).toBe(200);
      let responseBody = JSON.parse(data.body);
      expect(responseBody.data.length).toBe(1);
      expect(responseBody.count).toBe(1);
      expect(responseBody.limit).toBe(1);
      expect(responseBody.pagination.previousCursor).toBeNull();
      let nextCursor = Buffer.from(responseBody.pagination.nextCursor, 'base64').toString('ascii')
      expect(nextCursor).toBe(JSON.stringify(lastEvaluatedKey));
      done();
    } catch (error) {
      done(error);
    };
  };
  lists.getAll(exampleEvent, {}, lambdaCallback)
});

test('Test list not found', done => {
    AWS.DynamoDB.DocumentClient.prototype.get.mockImplementationOnce((_, callback) => callback(null, {}));
    const exampleEvent = {'pathParameters' : {'listId' : mockId}}
    const lambdaCallback = (err, data) => {
      try {
        console.log(data)
        expect(data.statusCode).toBe(404);
        done();
      } catch (error) {
        done(error);
      };
    };
    lists.getOne(exampleEvent, {}, lambdaCallback)
  });

test('Test get valid list', done => {
    AWS.DynamoDB.DocumentClient.prototype.get.mockImplementationOnce((_, callback) => callback(null, {'Item' : {'listId' : mockId, 'title': mockTitle}}));
    const exampleEvent = {'pathParameters' : {'listId' : mockId}}
    const lambdaCallback = (err, data) => {
      try {
        let responseBody = JSON.parse(data.body);
        expect(data.statusCode).toBe(200);
        expect(responseBody.listId).toBe(mockId);
        expect(responseBody.title).toBe(mockTitle);
        done();
      } catch (error) {
        done(error);
      };
    };
    lists.getOne(exampleEvent, {}, lambdaCallback)
  });

test('Test create valid list', done => {
    AWS.DynamoDB.DocumentClient.prototype.put.mockImplementationOnce((_, callback) => callback(null, {'Item': {'title': mockTitle}}));
    const exampleEvent = {
      'headers' : {
        'Authorization': 'Bearer xxxx'
      },
      'body' : '{\"title\":\"'+mockTitle+'\",\"details\":\"test details\"}'
    }
    const lambdaCallback = (err, data) => {
      try {
        let responseBody = JSON.parse(data.body);
        expect(data.statusCode).toBe(200);
        expect(responseBody.title).toBe(mockTitle);
        expect(responseBody.createdBy).toBe(mockUserId);
        done();
      } catch (error) {
        done(error);
      };
    };
    lists.createOne(exampleEvent, {}, lambdaCallback)
  });

  test('Test delete valid list', done => {
    AWS.DynamoDB.DocumentClient.prototype.delete.mockImplementationOnce((_, callback) => callback(null, {'Attributes': {'title': mockTitle}}));
    const exampleEvent = {
      'headers' : {
        'Authorization': 'Bearer xxxx'
      },
      'pathParameters' : {'listId' : mockId}
    }
    const lambdaCallback = (err, data) => {
      try {
        expect(data.statusCode).toBe(200);
        done();
      } catch (error) {
        done(error);
      };
    };
    lists.deleteOne(exampleEvent, {}, lambdaCallback)
  });

  test('Test delete list not found', done => {
    AWS.DynamoDB.DocumentClient.prototype.delete.mockImplementationOnce((_, callback) => callback(null, {}));
    const exampleEvent = {
      'headers' : {
        'Authorization': 'Bearer xxxx'
      },
      'pathParameters' : {'listId' : mockId}
    }
    const lambdaCallback = (err, data) => {
      try {
        expect(data.statusCode).toBe(404);
        done();
      } catch (error) {
        done(error);
      };
    };
    lists.deleteOne(exampleEvent, {}, lambdaCallback)
  });