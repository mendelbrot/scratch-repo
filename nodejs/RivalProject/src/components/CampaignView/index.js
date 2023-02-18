import React, { Component } from 'react';
import '../../styles/campaignView.css';
import AssetsView from './AssetsView';
import TabView from './TabView';
import styled from 'styled-components';
import NavBarComponent from '../NavBarComponent';
import CampaignSettings from './CampaignSettings';
import Summary from './Summary';
import ApiHelper from '../../helpers/ApiHelper';

const LinkButton = styled.a`
    padding: 10px;   
    margin: 10px;
    margin-top: 50px;
    border: 1px solid black;
    border-radius: 5px;
    background-color: red;
    position: fixed;
    bottom: 100px;
    right: 100px;
    &:hover { 
        background-color: yellow;
    }
`;

class CampaignView extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeTab: '1',
            images: [],
            cardResults: [],
            selectedIndex: null,
            viewSummary: false,

            selectedCampaign: {
                id: this.props.location.state ? this.props.location.state.selectedCampaignId : 0,
                name: "",
                isActive: false,
                hasPrizes: false
            },
            selectedOverlay: {},
            selectedOverlayImage: {}
        }
        this.setState = this.setState.bind(this);
    }


    loadCampaign() {
        ApiHelper.fetch('api/campaigns/' + this.state.selectedCampaign.id, {
            method:
                'GET',
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("token"),
                "Content-type": "application/json"
            }
        }).then(res => {
            const campaign = res;
            const overlay = campaign.template;
            const overlayImage = overlay.image || {};
            const cardResults = campaign.cardResults;
            delete overlay.image;
            delete campaign.template;

            this.setState({
                selectedCampaign: campaign,
                selectedOverlay: overlay,
                selectedOverlayImage: overlayImage,
                cardResults: cardResults
            })
        })
        .catch(err => {
            console.error(err);
        })
    }

    saveChanges() {
        let hasNonPrizes = false;
        const campaign = Object.assign({}, this.props.selectedCampaign);
        const overlay = Object.assign({}, this.props.selectedOverlay);
        const overlayImage = Object.assign({}, this.props.selectedOverlayImage);
        const cardResults = this.props.cardResults.map(cardRes => {
            hasNonPrizes = hasNonPrizes || !cardRes.prize;
            let copy = Object.assign({}, cardRes);
            copy.image = cardRes.image.id;
            return copy;
        });
        campaign.url = window.location.hostname + '/scratch/' + this.props.selectedCampaign.id
        overlay.image = overlayImage.id;
        campaign.template = overlay;
        campaign.cardResults = cardResults;
        if(campaign.hasPrizes && campaign.estimatedParticipants <= 0) {
            window.alert("Estimated participants cannot be 0! Please enter a value")
        } else if(!hasNonPrizes) {
            window.alert("Please add at least one card result without a prize");
        } else {
            ApiHelper.fetch('api/campaigns/' + this.props.selectedCampaign.id, {
                method:
                    'PATCH',
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("token"),
                    "Content-type": "application/json"
                },
                body: JSON.stringify(campaign)
            }).then(json => {
                window.alert("Changes Saved!")
            }).catch(err => {
                console.error(err);
            });
        }
    }



    componentDidMount() {
        this.loadCampaign()
    }


    render() {
        if (this.state.viewSummary) {
            return <Summary {...this.state} setState={this.setState} />
        } else {
            return (
                <div>
                    <NavBarComponent />
                    <CampaignSettings saveChanges={this.saveChanges} {...this.state} setState={this.setState}></CampaignSettings>
                    <div className='content-wrapper main-wrapper'>
                        <div className='left-wrapper sub-wrapper'>
                            <AssetsView {...this.state} setState={this.setState} ></AssetsView>
                        </div>
                        <div className='right-wrapper sub-wrapper'>
                            <TabView {...this.state} setState={this.setState}></TabView>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
export default CampaignView;