const lists = require('../api/v1/lists');

jest.setTimeout(1000);
let mockId = 1;
let mockTitle = 'Test Title';

jest.mock("aws-sdk", () => {
    const mDocumentClient = {
        delete: jest.fn().mockImplementation((_, callback) => callback(null, {})),
        get: jest.fn().mockImplementation((_, callback) => callback(null, {'Item' : {'id' : mockId, 'title': mockTitle}})),
        put: jest.fn().mockImplementation((_, callback) => callback(null, {'Item': {'title': mockTitle}})),
        scan: jest.fn().mockImplementation((_, callback) => callback(null, {'Items' :[{'id' : mockId, 'title': mockTitle}]}))
    };
    const mDynamoDB = { DocumentClient: jest.fn(() => mDocumentClient) };
    return { DynamoDB: mDynamoDB };
  });

test('Test getAll lists empty response', done => {
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

test('Test getAll lists non-empty response', done => {
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
    lists.get(exampleEvent, {}, lambdaCallback)
  });

test('Test get valid list', done => {
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
    lists.get(exampleEvent, {}, lambdaCallback)
  });

test('Test create valid list', done => {
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