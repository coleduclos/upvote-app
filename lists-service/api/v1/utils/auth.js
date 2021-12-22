'use strict';

const jwtDecode = require('jwt-decode');

function getAccessToken(request){
    const authHeader = request.headers.Authorization;
    // Remove "Bearer " from auth header
    const accessToken = authHeader.substring(7)
    return accessToken;
}
function getUserInfo(accessToken){
    var decoded = jwtDecode(accessToken);
    return decoded.sub;
}

function getUserIdFromRequest(request, callback){
    const accessToken = getAccessToken(request);
    console.debug('Attempting to lookup user id via access token...')
    const userId = getUserInfo(accessToken);
    if (userId) {
        callback(null, userId)
    } else {
        callback(new Error("Could not find user id via access token!"), null)
    }
}

module.exports = {getUserIdFromRequest}
