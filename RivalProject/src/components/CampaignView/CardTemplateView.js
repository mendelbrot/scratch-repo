import React, { Component } from 'react';
import SingleCardState from './SingleCardState';

import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Container, Row, Col
} from 'reactstrap';



const imgWidth = 300;
const imgHeight = 300;

class CardTemplateView extends Component {
    constructor(props) {
        super(props)

    }


    componentDidMount(){

    }

    render() {
        if (this.props.overlay){
            return (
                <div className='wrapper'>
                    <SingleCardState
                        editable
                        overlay
                        {...this.props}
                        imgWidth={imgWidth}
                        imgHeight={imgHeight}
                    />
                </div>
                

            )
        } else if (this.props.index) {
            return (
                <div className='wrapper'>
                    <SingleCardState
                        editable
                        index
                        {...this.props}
                        imgWidth={imgWidth}
                        imgHeight={imgHeight}
                    />
                </div>
            )
        }
    }
}
export default CardTemplateView;