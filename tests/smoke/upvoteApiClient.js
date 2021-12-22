'use strict';

const axios = require('axios');
const cognito = require('amazon-cognito-identity-js');

class UpvoteApiClient{
    constructor(username, password, apiEndpoint) {
        var poolData = {
            UserPoolId : process.env.COGNITO_USER_POOL_ID,
            ClientId : process.env.COGNITO_CLIENT_ID
        };
        this.userPool = new cognito.CognitoUserPool(poolData);
        this.apiEndpoint = apiEndpoint;
        // TODO: find a way to not store password in object
        this.username = username;
        this.password = password;
    }
    authenticateUser(callback){
        var userData = {
            Username : this.username,
            Pool : this.userPool
        };
        var cognitoUser = new cognito.CognitoUser(userData);

        var authenticationData = {
            Username : this.username,
            Password : this.password,
        };
        var authenticationDetails = new cognito.AuthenticationDetails(authenticationData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.debug('Successfully authenticated user.')
                callback(null, result)
            },
        
            onFailure: function(err) {
                console.error('Could not authenticate user!')
                console.error(err);
                callback(err, null)
            }
        });
    }
    handleError(error, callback){
        if (error.response) {
            console.error('Status code was not 200!')
            console.log(error.request)
            console.log(error.response.data);
            console.log(error.response.status);
          } else if (error.request) {
            console.error('Did not recieve response!');
          } else {
            console.error('Unknown error occuring making API request.');
          }
          console.error(error.message);
          callback(error, null);
    }
    createList(title, details, callback){
        const url = this.apiEndpoint + '/lists'
        this.authenticateUser((err, authData) => {
            if (err) {
                console.error('Could not create list!');
                callback(err, null)
            } else {
                let requestConfig = {
                    headers: {
                        Authorization: 'Bearer ' + authData.getAccessToken().getJwtToken(),
                    }
                }
                const data = {
                    "title" : title,
                    "details": details
                }
                axios.post(url, data, requestConfig)
                    .then(response => {
                        console.debug('Successfully created list.')
                        // console.debug(response)
                        callback(null, response.data)
                    })
                    .catch(error => {
                        console.error('Could not create list!');
                        this.handleError(error, callback);
                    });
            }
        })
    }
    getList(){

    }
    getAllLists(){

    }

}

module.exports = UpvoteApiClient