import React, {} from 'react';
import { API, Auth } from 'aws-amplify';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";

import UpvoteApiClient from '../utils/upvoteApiClient';

class ListCreateForm extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            'title': '',
            'details': ''
        };
    }
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    handleSubmit = async () => {
        console.log('Attempting to create list...');
        const path = '/lists';
        const apiClient = new UpvoteApiClient();
        apiClient.postData(path, this.state).then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log('ERROR! ' + error);
        });
    }
    render() {
        return(
            <div>
                <Typography variant="h4">New List</Typography>
                <div id="list" name="list">
                        <TextField
                            id="title"
                            name="title"
                            label="List Title"
                            onChange={this.handleInputChange}
                            value={this.state.title}
                            placeholder="List Title" 
                            required />
                        <TextField
                            name="details"
                            id="details"
                            onChange={this.handleInputChange}
                            value={this.state.details}
                            placeholder="List Details"
                            label="List Details"
                            multiline
                            rows={4}
                            required
                        />
                </div>
                <Button variant="contained"
                    name="listSubmit"
                    id="listSubmit"
                    onClick={this.handleSubmit}>
                        Create List
                </Button>
            </div>
        );
    }
}
export default ListCreateForm;