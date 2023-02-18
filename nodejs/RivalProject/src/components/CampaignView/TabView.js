import React, { Component } from 'react';
//import Upload from '../upload/Upload';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import '../../styles/campaignView.css';
//import { } from '../../styles/componentStyles';
import CardTemplateView from './CardTemplateView';
import CampaignCardResults from './CampaignCardResults';
import SetPrize from './SetPrize';
import { BorderBox } from '../../styles/componentStyles';


class TabView extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.toggle = this.toggle.bind(this);
    }

    toggle(tab) {
        if (this.props.activeTab !== tab) {
            this.props.setState({
                activeTab: tab
            });
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className='wrapper'>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.props.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}
                        >
                            Overlay Image
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.props.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                        >
                            Card Results
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.props.activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm="12">
                                <CardTemplateView
                                    overlay
                                    {...this.props}
                                ></CardTemplateView>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col sm="12">
                                <CardTemplateView
                                    index
                                    {...this.props}
                                ></CardTemplateView>
                                <BorderBox>
                                    {this.props.selectedCampaign.hasPrizes ? <SetPrize {...this.props} idx={this.props.selectedIndex} /> : null}
                                </BorderBox>
                                <CampaignCardResults {...this.props}></CampaignCardResults>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </div>

        )
    }
}

export default TabView;