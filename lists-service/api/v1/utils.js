'use strict';

const AWS = require('aws-sdk');

function getAccessToken(request){
    const authHeader = request.headers.Authorization;
    // Remove the term "Bearer " from token
    return authHeader.substring(7);
}
function getUser(accessToken, callback){
    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    var params = { AccessToken: accessToken};
    cognitoidentityserviceprovider.getUser(params, function(err, data) {
        if (err) {
            console.error('Could not get user info from access token!')
            console.error(err, err.stack)
            callback(err, null)
        } else {
            console.log('Successfully obtained the user info from access token.')
            callback(null, data);
        }
    });
}

function getUserIdFromRequest(request, callback){
    const accessToken = getAccessToken(request);
    console.log('Attempting to get user id from access token...' + accessToken)
    getUser(accessToken, function(err, data) {
        if (err) {
            console.error('Could not get userId from access token!')
            callback(err, null)
        } else {
            const userId = data.UserAttributes.sub
            console.log(data, userId)
            callback(null, userId)
        }
    })
}

module.exports = {getUserIdFromRequest}
