import React, { Component } from 'react';
import styled from 'styled-components'
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Container, Row, Col, Input, Collapse
} from 'reactstrap';
import { BorderBox} from '../../styles/componentStyles';

class SetPrize extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showForm: false,
            name: '',
            quantity: 0
        }

        this.showForm = this.showForm.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.cancel = this.cancel.bind(this);
        this.inputUpdate = this.inputUpdate.bind(this);
        this.removePrize = this.removePrize.bind(this);
    }

    inputUpdate = e => {
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    removePrize = e => {
        var idx = this.props.idx;

        var modifiedCardResult = this.props.cardResults[idx];
        modifiedCardResult.prize = null;
        var newCardResultArray = this.props.cardResults;
        newCardResultArray.splice(idx, 1, modifiedCardResult);

        this.props.setState({
            cardResults: newCardResultArray
        })
    }

    showForm() {
        this.setState({ showForm: true });

        var prize = this.props.cardResults[this.props.idx].prize;
        if (prize) {
            this.setState({name: prize.name, quantity: prize.quantity})
        }
    };

    saveChanges() {

        var idx = this.props.idx;

        var prize = {
            name: this.state.name,
            quantity: this.state.quantity
        }

        var modifiedCardResult = this.props.cardResults[idx];
        modifiedCardResult.prize = prize;
        var newCardResultArray = this.props.cardResults;
        newCardResultArray.splice(idx, 1, modifiedCardResult);

        this.props.setState({
            cardResults: newCardResultArray
        })

        this.setState({ showForm: false });
    };

    cancel() {
        this.setState({ showForm: false });
    };

    render() {
        if (this.props.cardResults[this.props.idx]) {
            if (this.state.showForm) {
                return (
                    <div>
                        <>Prize Name: </><Input
                            id='name'
                            value={this.state.name}
                            onChange={this.inputUpdate}
                        /><br />
                        <>Quantity: </><Input
                            id='quantity'
                            value={this.state.quantity}
                            type='number'
                            min='0'
                            onChange={this.inputUpdate}
                        /><br />
                        <Button onClick={this.saveChanges} style={{ backgroundColor: '#E8542A', margin: '5px' }}>Save Changes</Button>
                        <Button onClick={this.cancel} color='secondary'>Cancel</Button>
                    </div>
                )
            } else {
                if (this.props.cardResults[this.props.idx].prize) {
                    return (
                        <div>
                            <>Prize Name: </><>{this.props.cardResults[this.props.idx].prize.name}</><br />
                            <>Quantity: </><>{this.props.cardResults[this.props.idx].prize.quantity}</><br />
                            <Button onClick={this.showForm} style={{ backgroundColor: '#E8542A', margin: '5px' }}>Edit Prize</Button>
                            <Button color='danger' onClick={this.removePrize} style={{ margin: '5px' }}>Remove Prize</Button>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <Button onClick={this.showForm} style={{ backgroundColor: '#E8542A', margin: '5px' }}>Add a Prize</Button>
                        </div>
                    )
                }
            }
        } else {
            return <div/>
        }
        
    }
}
export default SetPrize;