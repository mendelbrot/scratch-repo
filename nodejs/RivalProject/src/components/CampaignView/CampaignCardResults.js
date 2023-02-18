import React, { Component } from 'react';
import '../../styles/campaignView.css';
import { ImgThumbImg } from '../../styles/componentStyles';


class CampaignCardResults extends Component {
    constructor(props) {
        super(props)

        this.setSelectedIndex = this.setSelectedIndex.bind(this);
        this.triggerDelete=this.triggerDelete.bind(this);
    }

    triggerDelete(idx){
        let imageList = this.props.cardResults;
        imageList.splice(idx, 1);
        this.props.setState({cardResults: imageList});
    }

    setSelectedIndex = (idx) => {
        this.props.setState({selectedIndex: idx});
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <ul className="results-list">
                    {this.props.cardResults.map((cardresult,idx) => 
                        <li key={idx}>
                            <button onClick={(e) => {
                                this.triggerDelete(idx)
                            }} className="delete-img">
                                X
                            </button>
                            <ImgThumbImg 
                                src={cardresult.image.path} 
                                onClick={(e) => {this.setSelectedIndex(idx)}}
                                alt="Selected Prize Image" 
                            />
                            <p>{cardresult.title}</p>
                        </li>
                    )}
                </ul>
            </div>

        )
    }
}
export default CampaignCardResults;