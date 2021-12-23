
jest.setTimeout(5000);

const UpvoteApiClient = require('./upvoteApiClient.js')

const upvoteApiCient = new UpvoteApiClient(
    process.env.TEST_USERNAME,
    process.env.TEST_PASSWORD, 
    process.env.TEST_API_ENDPOINT
);

const testListTitle = 'Test List A';
const testListDetails = 'This is a test list that should be deleted.';
const testListItemTitle = 'Test List Item 1';
const testListItemDetails = 'This is a test list item that should be deleted.';

let testList;
let testListItem;

describe("Upvote API test suite", () => {

    test("Test creating list", () => {
        return upvoteApiCient.createList(testListTitle, testListDetails).then(data => {
            testList = data;
            expect(data.title).toBe(testListTitle);
            expect(data.details).toBe(testListDetails);
        });
    });

    test("Test retrieving list", () => {
        return upvoteApiCient.getList(testList.listId).then(data => {
            expect(data.listId).toBe(testList.listId);
            expect(data.title).toBe(testList.title);
            expect(data.details).toBe(testList.details);
        });
    });

    test("Test creating list item", () => {
        return upvoteApiCient.createListItem(testList.listId, testListItemTitle, testListItemDetails).then(data => {
            testListItem = data;
            expect(data.itemId).not.toBeNull();
            expect(data.listId).toBe(testList.listId);
            expect(data.title).toBe(testListItemTitle);
            expect(data.details).toBe(testListItemDetails);
        });
    });

    test("Test retrieving list item", () => {
        return upvoteApiCient.getListItem(testListItem.listId, testListItem.itemId).then(data => {
            expect(data.itemId).toBe(testListItem.itemId);
            expect(data.listId).toBe(testListItem.listId);
            expect(data.title).toBe(testListItem.title);
            expect(data.details).toBe(testListItem.details);
        });
    });

    test("Test deleting list item", () => {
        return upvoteApiCient.deleteListItem(testListItem.listId, testListItem.itemId).then(data => {
            expect(data.message).toBe("success");
        });
    });

    test("Test deleting list", () => {
        return upvoteApiCient.deleteList(testList.listId).then(data => {
            expect(data.message).toBe("success");
        });
    });

});