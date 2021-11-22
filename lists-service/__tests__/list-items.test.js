const lists = require('../api/v1/list-items');

jest.mock("aws-sdk", () => {
    const mDocumentClient = { 
        get: jest.fn().mockImplementationOnce((_, callback) => callback(null, {})),
        put: jest.fn(),
        scan: jest.fn().mockImplementationOnce((_, callback) => callback(null, {'Items' :[]}))
    };
    const mDynamoDB = { DocumentClient: jest.fn(() => mDocumentClient) };
    return { DynamoDB: mDynamoDB };
  });

test('Test getAll list items empty response', async () => {
    const lambdaCallback = (err, data) => {
        expect(data.statusCode).toBe(200)
      };
    await lists.getAll({}, {}, lambdaCallback)
  });

test('Test getAll list items non-empty response', async () => {
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

test('Test create valid list item', async () => {
    const exampleEvent = {'body' : '{\"title\":\"test item title\",\"details\":\"test item details\"}'}
    const lambdaCallback = (err, data) => {
        expect(data.statusCode).toBe(200)
      };
    await lists.create(exampleEvent, {}, lambdaCallback)
  });