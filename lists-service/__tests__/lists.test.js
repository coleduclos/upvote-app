const lists = require('../api/v1/lists');

jest.mock("aws-sdk", () => {
    const mDocumentClient = {
        delete: jest.fn().mockImplementationOnce((_, callback) => callback(null, {})),
        get: jest.fn().mockImplementationOnce((_, callback) => callback(null, {})),
        put: jest.fn(),
        scan: jest.fn().mockImplementationOnce((_, callback) => callback(null, {'Items' :[]}))
    };
    const mDynamoDB = { DocumentClient: jest.fn(() => mDocumentClient) };
    return { DynamoDB: mDynamoDB };
  });

test('Test getAll lists empty response', async () => {
    const lambdaCallback = (err, data) => {
        expect(data.statusCode).toBe(200)
      };
    await lists.getAll({}, {}, lambdaCallback)
  });

test('Test getAll lists non-empty response', async () => {
    const lambdaCallback = (err, data) => {
        expect(data.statusCode).toBe(200)
      };
    await lists.getAll({}, {}, lambdaCallback)
  });

test('Test list not found', async () => {
    const exampleEvent = {'pathParameters' : {'id' : 1}}
    const lambdaCallback = (err, data) => {
        expect(data.statusCode).toBe(404)
      };
    await lists.get(exampleEvent, {}, lambdaCallback)
  });

test('Test get valid list', async () => {
    const exampleEvent = {'pathParameters' : {'id' : 1}}
    const lambdaCallback = (err, data) => {
        expect(data.statusCode).toBe(200)
      };
    await lists.get(exampleEvent, {}, lambdaCallback)
  });

test('Test create valid list', async () => {
    const exampleEvent = {'body' : '{\"title\":\"test title\",\"details\":\"test details\"}'}
    const lambdaCallback = (err, data) => {
        expect(data.statusCode).toBe(200)
      };
    await lists.create(exampleEvent, {}, lambdaCallback)
  });

  test('Test delete valid list', async () => {
    const exampleEvent = {'pathParameters' : {'id' : 1}}
    const lambdaCallback = (err, data) => {
        expect(data.statusCode).toBe(200)
      };
    await lists.delete(exampleEvent, {}, lambdaCallback)
  });

  test('Test delete not found', async () => {
    const exampleEvent = {'pathParameters' : {'id' : 1}}
    const lambdaCallback = (err, data) => {
        expect(data.statusCode).toBe(404)
      };
    lists.delete(exampleEvent, {}, lambdaCallback)
  });