import React, {} from 'react';
import { API, Auth } from 'aws-amplify';

import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import ListCreateForm from "./ListCreateForm"

import UpvoteApiClient from '../utils/upvoteApiClient';

class Lists extends React.Component {

    constructor() {
        super()
        this.state = { lists: [], showListCreateForm:false}
    }
    
    componentDidMount() {
        console.log('Attempting to get lists...');
        const path = '/lists';
        const apiClient = new UpvoteApiClient();
        apiClient.getData(path).then(response => {
            console.log(response)
            this.setState({ lists: response.data })
        })
        .catch(error => {
            console.log('ERROR! ' + error);
        });
    }

    _showListCreateForm = (bool) => {
        this.setState({
            showListCreateForm: bool
        });
    }

    render() {
        return (
            <div>
                <Typography variant="h2">Lists</Typography>
                { !this.state.showListCreateForm && (
                <IconButton onClick={this._showListCreateForm.bind(null, true)}>
                    <AddIcon/>
                </IconButton>
                )}
                { this.state.showListCreateForm && (<ListCreateForm/>) }
                <ul>
                    {this.state.lists.map(list => {
                        return <li key={`list-${list.listId}`}>{list.title}</li>
                    })}
                </ul>
            </div>
        )
    }
}
export default Lists;