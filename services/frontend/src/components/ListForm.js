import React, {} from 'react';
import { API, Auth } from 'aws-amplify';

async function postData(path, body) {
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

class ListForm extends React.Component {
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
        postData(path, this.state).then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log('ERROR! ' + error);
        });
    }
    render() {
        return(
            <div id="list-container" className="container">
            <div className="row">
                <div className="col-md-6 col-md-offset-3">
                    <h4 className="mb-3">Lists</h4>
                    <div id="list" name="list">
                        <div className="form-group">
                            <label htmlFor="title">List Title</label>
                            <input type="text" className="form-control" name="title" id="title" onChange={this.handleInputChange} value={this.state.title} placeholder="List Title" required="" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="details">List Details</label>
                            <textarea className="form-control" name="details" id="details" onChange={this.handleInputChange} value={this.state.details} placeholder="List Details" rows="3"></textarea>
                        </div>
                    </div>
                    <button className="btn btn-primary btn-lg btn-block" onClick={this.handleSubmit} name="listSubmit" id="listSubmit">Create List</button>
                </div>
            </div>
            </div>
        );
    }
}
export default ListForm;