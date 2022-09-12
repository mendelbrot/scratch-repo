import React from 'react';
import { BrowserRouter, Link} from 'react-router-dom';
import EnsureLoggedIn from '../EnsureLoggedIn';
import logo from '../images/Rivallogo.png';
import styled from 'styled-components';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem
} from 'reactstrap';

import '../App.css';

const LinkButton = styled.a`
    background: #E8542A;
    padding: 10px 25px;
    border: #E8542A 1px solid;
    border-radius: 5px;
    color: #fff;
    text-decoration: none;
    &:hover { 
        background: #222;
        color: #fff;
        text-decoration: none;
    }
`;

const NavBarComponent = () => (
    <div>
        <Navbar>
            <NavbarBrand><img src={logo} className="nav-logo" /></NavbarBrand>
            <Nav navbar>
                <EnsureLoggedIn invertCondition={true}>
                    <LinkButton className="primary-button" href="/login">Login</LinkButton>
                </EnsureLoggedIn>
                <EnsureLoggedIn>
                    <a className="SingleLink" href="/logout">Log Out</a>
                </EnsureLoggedIn>
            </Nav>
        </Navbar>
    </div>
)
export default NavBarComponent;

