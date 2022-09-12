import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import ApiHelper from '../../helpers/ApiHelper';
import '../../styles/createCampaign.css';

class CreateCampaign extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            title: "",
            estimatedParticipants: null,
            redirect: false
        };
        this.handleTitle = this.handleTitle.bind(this);
        this.handleParticipants = this.handleParticipants.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    renderRedirect = () => {
        
        if (this.state.redirect) {
            return <Redirect to={{ 
                pathname:'/campaignview', 
                state: {selectedCampaignId: this.state.id}
            }}  />
        }
    }
    handleSubmit() {
        ApiHelper.fetch('api/campaigns/', {
            method:
                'POST',
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("token"),
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                'name': this.state.title,
                'hasPrizes': this.state.hasPrizes,
                'estimatedParticipants': this.state.estimatedParticipants
            })
        })
        .then(res => {
            this.setState({
                id: res.id,
                redirect: true
            })
        })
        .catch(err => {
            console.error(err);
        })
    }

    handleTitle(event) {
        this.setState({ title: event.target.value });
    }

    handleParticipants(event) {
        this.setState({ estimatedParticipants: event.target.value });
    }

    render() {
        return (
            <div className="createCampaign" >
                <div className="innerDivCreate">
                    <Button onClick={this.props.closePopup}
                        className="cancelButton" close>
                    </Button>

                    <Form className="formCreateCampaign">
                    {this.renderRedirect()}
                        <FormGroup>
                            <Label htmlFor="title">Campaign Title</Label>
                            <Input type="text" id="title" value={this.state.title} onChange={this.handleTitle} />
                        </FormGroup>

                        <Button
                            onClick={this.handleSubmit}
                            color="success">
                            Create
                        </Button>

                    </Form>
                </div>
            </div>
        )
    }
}

export default CreateCampaign;