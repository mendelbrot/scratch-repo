import React, { Component } from 'react';
import '../../styles/campaignView.css';
import ImagesList from './ImagesList';


class AssetsView extends Component {
    constructor(props) {
        super(props)

        this.state = { 
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className='assets-view-wrapper'> 
                <ImagesList {...this.props}></ImagesList>  
            </div>
        )
    }
}
export default AssetsView;