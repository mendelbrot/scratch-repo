import React, { Component } from 'react';
import {ImgThumbImg} from '../../styles/componentStyles';


class ImageThumb extends Component {

    setImage(e) {
        if(this.props.activeTab === '1'){
            this.props.selectedOverlayImage.path = e.target.src;
            this.props.selectedOverlayImage.id = e.target.alt;
            this.props.setState({selectedOverlayImage: this.props.selectedOverlayImage});
        } else if(this.props.activeTab === '2'){
            var newArray = this.props.cardResults;
            newArray.push({
                image: { path: e.target.src, id: e.target.alt },
                title: '',
                prize: null
            });
            this.props.setState({results:newArray});
        }  
    }


    render() {
        return (
                <ImgThumbImg src={this.props.imagePath} alt={this.props.imageId} onClick={this.setImage.bind(this)} />
        );
    }
}

export default ImageThumb;