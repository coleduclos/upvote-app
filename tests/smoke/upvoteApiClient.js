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

    // --------- LISTS API ---------
    createList(title, details){
        return new Promise((resolve, reject) => {
            const url = this.apiEndpoint + '/lists'
            this.authenticateUser((err, authData) => {
                if (err) {
                    console.error('Could not create list!');
                    reject(err);
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
                            resolve(response.data)
                        })
                        .catch(err => {
                            console.error('Could not create list!');
                            reject(err);
                        });
                }
            })
        })
    }
    deleteList(listId){
        return new Promise((resolve, reject) => {
            const url = this.apiEndpoint + '/lists/' + listId
            this.authenticateUser((err, authData) => {
                if (err) {
                    console.error('Could not delete list: ' + listId);
                    reject(err);
                } else {
                    let requestConfig = {
                        headers: {
                            Authorization: 'Bearer ' + authData.getAccessToken().getJwtToken(),
                        }
                    }
                    axios.delete(url, requestConfig)
                        .then(response => {
                            console.debug('Successfully deleted list.')
                            // console.debug(response)
                            resolve(response.data)
                        })
                        .catch(err => {
                            console.error('Could not delete list: ' + listId);
                            reject(err);
                        });
                }
            })
        })
    }
    getList(listId){
        return new Promise((resolve, reject) => {
            const url = this.apiEndpoint + '/lists/' + listId
            this.authenticateUser((err, authData) => {
                if (err) {
                    console.error('Could not retrieve list: ' + listId);
                    reject(err);
                } else {
                    let requestConfig = {
                        headers: {
                            Authorization: 'Bearer ' + authData.getAccessToken().getJwtToken(),
                        }
                    }
                    axios.get(url, requestConfig)
                        .then(response => {
                            console.debug('Successfully retrieved list.')
                            // console.debug(response)
                            resolve(response.data)
                        })
                        .catch(err => {
                            console.error('Could not retrieve list: ' + listId);
                            reject(err);
                        });
                }
            })
        })
    }
    getAllLists(){

    }

    // --------- LIST ITEMS API ---------
    createListItem(listId, title, details){
        return new Promise((resolve, reject) => {
            const url = this.apiEndpoint + '/lists/' + listId + '/items'
            this.authenticateUser((err, authData) => {
                if (err) {
                    console.error('Could not create list item!');
                    reject(err);
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
                            console.debug('Successfully created list item.')
                            // console.debug(response)
                            resolve(response.data)
                        })
                        .catch(err => {
                            console.error('Could not create list item!');
                            reject(err);
                        });
                }
            })
        })
    }
    deleteListItem(listId, itemId){
        return new Promise((resolve, reject) => {
            const url = this.apiEndpoint + '/lists/' + listId + '/items/' + itemId;
            this.authenticateUser((err, authData) => {
                if (err) {
                    console.error('Could not delete list item:');
                    console.error({'listId' : listId, 'itemId' : itemId});
                    reject(err);
                } else {
                    let requestConfig = {
                        headers: {
                            Authorization: 'Bearer ' + authData.getAccessToken().getJwtToken(),
                        }
                    }
                    axios.delete(url, requestConfig)
                        .then(response => {
                            console.debug('Successfully deleted list item.')
                            // console.debug(response)
                            resolve(response.data)
                        })
                        .catch(err => {
                            console.error('Could not delete list item:');
                            console.error({'listId' : listId, 'itemId' : itemId});
                            reject(err);
                        });
                }
            })
        })
    }
    getListItem(listId, itemId){
        return new Promise((resolve, reject) => {
            const url = this.apiEndpoint + '/lists/' + listId + '/items/' + itemId
            this.authenticateUser((err, authData) => {
                if (err) {
                    console.error('Could not retrieve list item: ');
                    console.error({'listId' : listId, 'itemId' : itemId});
                    reject(err);
                } else {
                    let requestConfig = {
                        headers: {
                            Authorization: 'Bearer ' + authData.getAccessToken().getJwtToken(),
                        }
                    }
                    axios.get(url, requestConfig)
                        .then(response => {
                            console.debug('Successfully retrieved list item.')
                            // console.debug(response)
                            resolve(response.data)
                        })
                        .catch(err => {
                            console.error('Could not retrieve list item: ');
                            console.error({'listId' : listId, 'itemId' : itemId});
                            reject(err);
                        });
                }
            })
        })
    }
}

module.exports = UpvoteApiClient