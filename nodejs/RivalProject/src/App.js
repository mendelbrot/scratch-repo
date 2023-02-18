import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import EnsureLoggedIn from './EnsureLoggedIn';
import Logout from './components/Logout'
import Demo from './components/Demo';
import CampaignView from './components/CampaignView/index';
import CreateCampaign from './components/CampaignCrud/CreateCampaign';
import DeleteCampaign from './components/CampaignCrud/DeleteCampaign';

import './App.css';


const CardCreatorApp = () => (
    <Router>
        <Switch>
            <Route exact path="/scratch/:campaignId" component={Demo} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <EnsureLoggedIn renderNav={true}>
                <Route exact path="/" component={Home} />
                <Route exact path="/CreateCampaign" component={CreateCampaign} />
                <Route exact path="/DeleteCampaign" component={DeleteCampaign} />
                <Route exact path="/campaignview" component={CampaignView} />                    
            </EnsureLoggedIn>
        </Switch>
    </Router>
)
export default CardCreatorApp;
