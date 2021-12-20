'use strict';

const https = require('https');

function getAccessToken(request){
    const accessToken = request.headers.Authorization;
    return accessToken;
}
function getUserInfo(accessToken, callback){
    console.debug('Attempting to lookup user info via access token...')
    // TODO: move hostname to environment variable
    const options = {
        hostname: 'upvote-dev.auth.us-west-2.amazoncognito.com',
        port: 443,
        path: '/oauth2/userInfo',
        method: 'GET',
        headers: {
            'Authorization' : accessToken
        }
    }
    var req = https.request(options, (resp) => {
        let data = '';
        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            if (resp.statusCode == 200) {
                console.debug('Successfully obtained the user info from access token.')
                callback(null, JSON.parse(data));
            } else {
                console.error('Could not find user info via access token! Status code: ' + resp.statusCode)
                callback(new Error('Unexpected status code while looking up user info'), null);
            }
        });
    })
    req.on("error", (err) => {
        console.error('Could not get user info from access token!')
        console.error(err, err.stack)
        callback(err, null)
    });
    req.end();
}

function getUserIdFromRequest(request, callback){
    const accessToken = getAccessToken(request);
    console.debug('Attempting to lookup user id via access token...')
    getUserInfo(accessToken, function(err, data) {
        if (err) {
            console.error('Could not find user id via access token!')
            callback(err, null)
        } else {
            const userId = data.sub
            callback(null, userId)
        }
    })
}

module.exports = {getUserIdFromRequest}
