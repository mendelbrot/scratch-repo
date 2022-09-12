import React from 'react'
import SingleCardState from './CampaignView/SingleCardState'
import ApiHelper from '../helpers/ApiHelper';
import ScratchCard from '../scratch-card'
import demoStyles from '../styles/demo.css';


class Demo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isCleared: false,
            campaign: {},
            overlay: {
                image: {}
            },
            result: {
                image: {}
            }
        }
        this.handleCleared = this.handleCleared.bind(this);
        this.setState = this.setState.bind(this);
        this.fetchRandom();
    }
    fetchRandom() {
        ApiHelper.fetch('/api/random/demo/' + this.props.match.params.campaignId, {
            method:
                'GET',
            headers: {
                "Content-type": "application/json"
            }
        }).then(res => {
            this.setState({
                campaign: res,
                overlay: res.template,
                result: res.result
            });
            delete res.template;
            delete res.result;
        }).catch(err => console.error(err));
    }

    handleCleared(e) {
        if (!this.state.isCleared){
            this.setState({isCleared: true});
        }
    }

    render() {
        const imgWidth = 300;
        const imgHeight = 300;

       // No API response yet
        if(!this.state.overlay.image.path)
            return <div>Loading...</div>;
        return (
            <div className="demo">
                <div className="demoCard">
                        {this.state.isCleared ?
                            <div className= "demoTitle">{this.state.result.title}</div>
                            : <div className= "demoTitle">{this.state.overlay.title}</div>
                        }
                      
                      <ScratchCard
                        isCleared={this.state.isCleared}
                        brush="brush"
                        width={imgWidth}
                        height={imgHeight}
                        percentToClear={50}
                        subRectRatio={0.7}
                        imgURL={this.state.overlay.image.path}
                        onClear={this.handleCleared}
                      >
                        <img
                          width={imgWidth}
                          height={imgHeight}
                          src={this.state.result.image.path}
                          alt="scratch card"
                          crossOrigin="Anonymous"
                        />
                      </ScratchCard>
                 
                </div>    

            </div>   
        )        
    }
}
export default Demo
