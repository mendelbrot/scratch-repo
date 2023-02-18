import React, { Component } from 'react';
import Upload from '../../upload/Upload';
import '../../styles/campaignView.css';
import ImageThumb from './ImageThumb';
import ApiHelper from '../../helpers/ApiHelper';

class ImagesList extends Component {
    constructor(props) {
        super(props)

        this.state = {}
        this.images = []
        this.deleteImages = this.deleteImages.bind(this);
    }

    componentDidMount() {
        this.fetchImages()
    }

    fetchImages() {
        ApiHelper.fetch('api/images',{
            headers: { 
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            }
        })
            .then(res => {
                this.images = res;
                this.props.setState({ images: this.images })
            })
            .catch(err => {
                console.error(err);
            })
    }

    onUpload(err, res) {
        if (err) {
            console.error(err);
        } else {
            this.images.push(res);
            this.props.setState({images: this.images})
            this.fetchImages()
        }
    }

    deleteImages(imageId, idx) {

        ApiHelper.fetch('api/images/' + imageId, {
            method: 'DELETE',
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            }
        })
            .then(res => {
                    let images = this.props.images;
                    images.splice(idx, 1);
                    this.props.setState({ images: images });
            }).catch(err => {
                if(err.status === 409) {
                    alert("unable to delete image: " + imageId);
                    this.fetchImages();
                }
                console.error(err);
            })
    }


    render() {
        return (
            <div>
                <div className='image-list-wrapper'>
                    <h3>Image Library</h3>
                    <Upload onUpload={this.onUpload.bind(this)}/>
                </div>
                <div>
                    <ul className="image-list">
                    {this.props.images.map((image, idx) => 
                        <li key={idx}>
                        <button onClick={(e)=>{this.deleteImages(image.id, idx)}} 
                        className="delete-img">
                                X
                        </button>
                        <ImageThumb imagePath={image.path} imageId={image.id} {...this.props}></ImageThumb></li>
                    )}
                    </ul>
                </div>
            </div>
        )
    }
}
export default ImagesList;