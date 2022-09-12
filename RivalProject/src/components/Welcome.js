import React, { Component } from 'react';
import '../App.css';
import arrow from '../images/arrow.png';

class Welcome extends Component {

    render(){
        return(
        <div>
            <div className="landingpage-wrapper">
                <h1>Welcome to the scratch & win card manager</h1>
                <h3>Login and get started on campaign creation!</h3>
            </div>
            <img src={arrow} alt="arrow" className="home-arrow"/>
        </div>
        )
    }
}

export default Welcome;