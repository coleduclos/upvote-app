'use strict';

import { API, Auth } from 'aws-amplify';

class UpvoteApiClient{
    constructor() {
    }
    async getData(path) {
        const apiName = 'UpvoteApi';
        const apiInit = {
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
            },
        };
        return await API.get(apiName, path, apiInit);
    }
    async postData(path, body) {
        const apiName = 'UpvoteApi';
        const apiInit = {
            body: body,
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
            },
        };
        console.log(body);
        return await API.post(apiName, path, apiInit);
    }
}

export default UpvoteApiClient;



