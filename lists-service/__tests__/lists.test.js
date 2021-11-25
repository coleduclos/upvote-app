const lists = require('../api/v1/lists');

jest.setTimeout(1000);
let mockId = 1;
let mockTitle = 'Test Title';

jest.mock("aws-sdk")

const AWS = require('aws-sdk')

test('Test getAll lists empty response', done => {
  AWS.DynamoDB.DocumentClient.prototype.scan.mockImplementationOnce((_, callback) => callback(null, {'Items' :[]}));
  const lambdaCallback = (err, data) => {
    try {
      expect(data.statusCode).toBe(200);
      let responseBody = JSON.parse(data.body);
      done();
    } catch (error) {
      done(error);
    };
  };
  lists.getAll({}, {}, lambdaCallback)
});

test('Test getAll lists non-empty response', done => {
    AWS.DynamoDB.DocumentClient.prototype.scan.mockImplementationOnce((_, callback) => callback(null, {'Items' :[{'id' : mockId, 'title': mockTitle}]}));
    const lambdaCallback = (err, data) => {
      try {
        expect(data.statusCode).toBe(200);
        done();
      } catch (error) {
        done(error);
      };
    };
    lists.getAll({}, {}, lambdaCallback)
  });

test('Test list not found', done => {
    AWS.DynamoDB.DocumentClient.prototype.get.mockImplementationOnce((_, callback) => callback(null, {'Item' : {}}));
    const exampleEvent = {'pathParameters' : {'id' : mockId}}
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
    AWS.DynamoDB.DocumentClient.prototype.get.mockImplementationOnce((_, callback) => callback(null, {'Item' : {'id' : mockId, 'title': mockTitle}}));
    const exampleEvent = {'pathParameters' : {'id' : mockId}}
    const lambdaCallback = (err, data) => {
      try {
        let responseBody = JSON.parse(data.body);
        expect(data.statusCode).toBe(200);
        expect(responseBody.id).toBe(mockId);
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
    const exampleEvent = {'body' : '{\"title\":\"'+mockTitle+'\",\"details\":\"test details\"}'}
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
    lists.create(exampleEvent, {}, lambdaCallback)
  });

  test('Test delete valid list', done => {
    AWS.DynamoDB.DocumentClient.prototype.delete.mockImplementationOnce((_, callback) => callback(null, {'Item': {'title': mockTitle}}));
    const exampleEvent = {'pathParameters' : {'id' : mockId}}
    const lambdaCallback = (err, data) => {
      try {
        expect(data.statusCode).toBe(200);
        done();
      } catch (error) {
        done(error);
      };
    };
    lists.delete(exampleEvent, {}, lambdaCallback)
  });

  test('Test delete not found', done => {
    AWS.DynamoDB.DocumentClient.prototype.delete.mockImplementationOnce((_, callback) => callback(null, {'Item': {'title': mockTitle}}));
    const exampleEvent = {'pathParameters' : {'id' : mockId}}
    const lambdaCallback = (err, data) => {
      try {
        expect(data.statusCode).toBe(404);
        done();
      } catch (error) {
        done(error);
      };
    };
    lists.delete(exampleEvent, {}, lambdaCallback)
  });