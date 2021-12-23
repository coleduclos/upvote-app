const votes = require('../v1/votes');

jest.setTimeout(1000);
let mockId = '0';
let mockUserId = '1';
let mockScore = 1

jest.mock("aws-sdk")

jest.mock('../v1/utils/auth.js', () => {
    return {
      getUserIdFromRequest: jest.fn().mockImplementationOnce((_, callback) => callback(null, mockUserId))
    };
});

const AWS = require('aws-sdk')

test('Test getAll votes empty response w/ default limit', done => {
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
  votes.getAll(exampleEvent, {}, lambdaCallback)
});

test('Test getAll votes non-empty response w/ default limit', done => {
    AWS.DynamoDB.DocumentClient.prototype.scan.mockImplementationOnce((_, callback) => callback(null, {
      'Items' :[{'voteId' : mockId, 'userId': mockUserId}],
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
    votes.getAll(exampleEvent, {}, lambdaCallback)
  });

test('Test getAll votes non-empty response w/ explicit limit & pagination', done => {
    const lastEvaluatedKey = { 'voteId': mockId };
    AWS.DynamoDB.DocumentClient.prototype.scan.mockImplementationOnce((_, callback) => callback(null, {
      'Items' :[{'vote' : mockId, 'userId': mockUserId}],
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
    votes.getAll(exampleEvent, {}, lambdaCallback)
  });

test('Test getAll votes non-empty response w/ filtering, explicit limit, & pagination', done => {
  const lastEvaluatedKey = { 'voteId': mockId };
  AWS.DynamoDB.DocumentClient.prototype.scan.mockImplementationOnce((_, callback) => callback(null, {
    'Items' :[{'vote' : mockId, 'userId': mockUserId}],
    'Count' : 1,
    'LastEvaluatedKey': lastEvaluatedKey
  }));
  AWS.DynamoDB.DocumentClient.prototype.query.mockImplementationOnce((_, callback) => callback(null, {
    'Items' :[{'voteId' : mockId, 'userId': mockUserId}],
    'Count' : 1,
    'LastEvaluatedKey': lastEvaluatedKey
  }));
  const exampleEvent = {'queryStringParameters' : {'limit':1, 'userId' : mockUserId}}
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
  votes.getAll(exampleEvent, {}, lambdaCallback)
});

test('Test vote not found', done => {
    AWS.DynamoDB.DocumentClient.prototype.get.mockImplementationOnce((_, callback) => callback(null, {}));
    const exampleEvent = {'pathParameters' : {'voteId' : mockId}}
    const lambdaCallback = (err, data) => {
      try {
        console.log(data)
        expect(data.statusCode).toBe(404);
        done();
      } catch (error) {
        done(error);
      };
    };
    votes.getOne(exampleEvent, {}, lambdaCallback)
  });

test('Test get valid vote', done => {
    AWS.DynamoDB.DocumentClient.prototype.get.mockImplementationOnce((_, callback) => callback(null, {'Item' : {'voteId' : mockId, 'userId': mockUserId}}));
    const exampleEvent = {'pathParameters' : {'voteId' : mockId}}
    const lambdaCallback = (err, data) => {
      try {
        let responseBody = JSON.parse(data.body);
        expect(data.statusCode).toBe(200);
        expect(responseBody.voteId).toBe(mockId);
        expect(responseBody.userId).toBe(mockUserId);
        done();
      } catch (error) {
        done(error);
      };
    };
    votes.getOne(exampleEvent, {}, lambdaCallback)
  });

test('Test create valid vote', done => {
    AWS.DynamoDB.DocumentClient.prototype.put.mockImplementationOnce((_, callback) => callback(null, {'Item': {'userId': mockUserId, 'score' : 1}}));
    const exampleEvent = {
      'headers' : {
        'Authorization': 'Bearer xxxx'
      },
      'body' : '{\"userId\":\"'+mockUserId+'\",\"score\": '+mockScore+'}'
    }
    const lambdaCallback = (err, data) => {
      try {
        let responseBody = JSON.parse(data.body);
        expect(data.statusCode).toBe(200);
        expect(responseBody.userId).toBe(mockUserId);
        expect(responseBody.score).toBe(mockScore);
        done();
      } catch (error) {
        done(error);
      };
    };
    votes.createOne(exampleEvent, {}, lambdaCallback)
  });

  test('Test delete valid vote', done => {
    AWS.DynamoDB.DocumentClient.prototype.delete.mockImplementationOnce((_, callback) => callback(null, {'Attributes': {'userId': mockUserId}}));
    const exampleEvent = {'pathParameters' : {'voteId' : mockId}}
    const lambdaCallback = (err, data) => {
      try {
        expect(data.statusCode).toBe(200);
        done();
      } catch (error) {
        done(error);
      };
    };
    votes.deleteOne(exampleEvent, {}, lambdaCallback)
  });

  test('Test delete vote not found', done => {
    AWS.DynamoDB.DocumentClient.prototype.delete.mockImplementationOnce((_, callback) => callback(null, {}));
    const exampleEvent = {'pathParameters' : {'voteId' : mockId}}
    const lambdaCallback = (err, data) => {
      try {
        expect(data.statusCode).toBe(404);
        done();
      } catch (error) {
        done(error);
      };
    };
    votes.deleteOne(exampleEvent, {}, lambdaCallback)
  });