
jest.setTimeout(5000);

const UpvoteApiClient = require('./upvoteApiClient.js')

const upvoteApiCient = new UpvoteApiClient(
    process.env.TEST_USERNAME,
    process.env.TEST_PASSWORD, 
    process.env.TEST_API_ENDPOINT
);

const testListTitle = 'Test List A';
const testListDetails = 'This is a test list that should be deleted.';

let testList;

describe("Upvote API test suite", () => {

    // test("Test creating list", () => {

    //     return upvoteApiCient.createListV2(testListTitle, testListDetails).then(data => {
    //         expect(data.title).toBe(testListTitle);
    //         expect(data.details).toBe(testListDetails);
    //         return upvoteApiCient.deleteList(data.listId)
    //     }).then(data => {
    //         expect(data.message).toBe("success");
    //     });
    // });

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

    test("Test deleting list", () => {
        return upvoteApiCient.deleteList(testList.listId).then(data => {
            expect(data.message).toBe("success");
        });
    });
});