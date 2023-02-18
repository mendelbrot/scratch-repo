import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import ApiHelper from '../../helpers/ApiHelper';


const LinkButton = styled.a` 
`;

class CampaignSettings extends Component {
    constructor(props) {
        super(props)
        this.state ={
            showHomepage: false,
        }
 
        this.handleStatusChange = this.handleStatusChange.bind(this)
        this.directToHome = this.directToHome.bind(this)
        this.handleCampaignNameChange = this.handleCampaignNameChange.bind(this)
        this.handleEstimatedPatricipantsChange = this.handleEstimatedPatricipantsChange.bind(this)
        this.saveChanges = this.props.saveChanges.bind(this)
        this.handlePrizeChange = this.handlePrizeChange.bind(this)

    }

    handleCampaignNameChange(e){
        this.props.selectedCampaign.name = e.target.value;
        this.props.setState({
           selectedCampaign: this.props.selectedCampaign
        })
    }

    handleEstimatedPatricipantsChange(e){
        this.props.selectedCampaign.estimatedParticipants = Math.max(e.target.value | 0, 0);
        this.props.setState({
           selectedCampaign: this.props.selectedCampaign
        })
    }

    handleStatusChange(e) {
        const target = e.target;
        const value = !!(target.type === 'checkbox' ? target.checked : target.value);
        this.props.selectedCampaign.isActive = value;
        this.props.setState({
            selectedCampaign: this.props.selectedCampaign
        })
    }
    
    handlePrizeChange(e) {
        const target = e.target;
        const value = !!(target.type === 'checkbox' ? target.checked : target.value);
        this.props.selectedCampaign.hasPrizes = value;
        this.props.selectedCampaign.estimatedParticipants = 0;
        this.props.setState({selectedCampaign: this.props.selectedCampaign});
    }

    directToHome() {
        this.setState({showHomepage: true})
    }

    renderRedirect = () => {
        if (this.state.showHomepage) {
            return <Redirect to={{
                pathname: '/',
            }}
            />
        }
    }

    viewSummary = () => {
        this.props.setState({ viewSummary: true })
    }


    render() {
        return (
                    <div className="main-wrapper">
                        <div className="flex">
                            {this.renderRedirect()}
                            <LinkButton className="icon back-icon">
                            <i class="fas fa-arrow-left" onClick={this.directToHome}></i>
                            </LinkButton>
                            <h2>Campaign Setup</h2>
                        </div>

                        <div className='settings-wrapper'>
                            <div className="campaign-main-info">
                                <div className="input-section">
                                    <h6>Campaign Name: </h6>
                                    <input type="text"  value={this.props.selectedCampaign.name} onChange={this.handleCampaignNameChange} placeholder="Campaign Name..."/>
                                </div>

                            <div className="input-section onoffswitch" data-tip="Activate campaign">
                                <input type="checkbox" 
                                       name="onoffswitch" 
                                       className="onoffswitch-checkbox" 
                                       id="myonoffswitch" 
                                       onChange={this.handleStatusChange}
                                       checked={this.props.selectedCampaign.isActive}/>
                                <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                <span className="onoffswitch-inner"></span>
                                <span className="onoffswitch-switch"></span>
                                </label>
                            </div>


                            <div className="input-section onoffswitch-hasPrize" data-tip="Activate Prize">
                                <input type="checkbox" 
                                       name="onoffswitch-hasPrize" 
                                       className="onoffswitch-checkbox-hasPrize" 
                                       id="myonoffswitch-hasPrize" 
                                       onChange={this.handlePrizeChange}
                                       checked={this.props.selectedCampaign.hasPrizes}/>
                                <label className="onoffswitch-label-hasPrize" htmlFor="myonoffswitch-hasPrize">
                                <span className="onoffswitch-inner-hasPrize"></span>
                                <span className="onoffswitch-switch-hasPrize"></span>
                                </label>
                            </div>

                            {this.props.selectedCampaign.hasPrizes ?
                                <div className="input-section estimatedParticipants">
                                    <h6>Estimated Participants: </h6>
                                    <input type="text" 
                                        value={this.props.selectedCampaign.estimatedParticipants} 
                                        onChange={this.handleEstimatedPatricipantsChange}
                                        placeholder="Estimated Participants..."
                                        />
                                </div>
                                : null
                            }

                            </div>
                            <div className="campaign-main-btns">
                                <ReactTooltip />
                                <LinkButton onClick={this.viewSummary} className="icon"><i class="fas fa-list-alt" data-tip="Campaign summary"></i></LinkButton>
                                <LinkButton href={"/scratch/" + this.props.selectedCampaign.id} className="icon"  data-tip="Demo link"><i class="fas fa-link"></i>
                                </LinkButton>
                                <LinkButton className="icon"
                                onClick={this.saveChanges}
                                >
                                <i class="fas fa-save"></i>
                                </LinkButton>
                            </div>   
                        </div>
                    </div>

                )
            }
        }
export default CampaignSettings;
