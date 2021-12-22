const UpvoteApiClient = require('./upvoteApiClient.js')

const upvoteApiCient = new UpvoteApiClient(
    process.env.TEST_USERNAME,
    process.env.TEST_PASSWORD, 
    process.env.TEST_API_ENDPOINT
);

const testListTitle = 'Test List A';
const testListDetails = 'This is a test list that should be deleted.';

upvoteApiCient.createList(testListTitle, testListDetails, (err, data)=>{
    if(err) {
        console.error('Create list test failed!');
        // console.log(err);
    } else {
        console.log('Create list test succeeded.');
        console.log(data);
    }
});

// describe('Upvote test suite', () => {

//     it('/lists endpoint', async() => {


//         // Make a request for a user with a given ID
//         axios.get('/user?ID=12345')
//         .then(function (response) {
//             // handle success
//             console.log(response);
//         })
//         .catch(function (error) {
//             // handle error
//             console.log(error);
//         })
//         .then(function () {
//             // always executed
//         });

//         const response = await request(app).get("/space/destinations");
//         expect(response.body).toEqual(["Mars", "Moon", "Earth", "Mercury", "Venus", "Jupiter"]);
//         expect(response.body).toHaveLength(6);
//         expect(response.statusCode).toBe(200);
//         // Testing a single element in the array
//         expect(response.body).toEqual(expect.arrayContaining(['Earth']));

//     });

//     // Insert other tests below this line

//     // Insert other tests above this line
// });