import React, { Component } from 'react';
import '../../styles/campaignView.css';
import SetPrize from './SetPrize';
import {Button, Modal} from 'reactstrap';
import { ImgThumbImg , ResultsList} from '../../styles/componentStyles';


class Summary extends Component {
    constructor(props) {
        super(props)

        this.setSelectedIndex = this.setSelectedIndex.bind(this);
        this.triggerDelete = this.triggerDelete.bind(this);
    }

    triggerDelete(idx) {
        let imageList = this.props.cardResults;
        imageList.splice(idx, 1);
        this.props.setState({ cardResults: imageList });
    }

    setSelectedIndex = (idx) => {
        this.props.setState({ selectedIndex: idx });
    }

    componentDidMount() {

    }

    render() {
        return (
            <Modal isOpen={this.props.viewSummary}>
                <ul>
                    {this.props.cardResults.map((cardResult, idx) =>
                        <ResultsList key={idx}>
                            <button
                                style={{ margin: '5px' }}
                                onClick={(e) => {
                                    this.triggerDelete(idx)
                                }} className="delete-img"
                            >
                                X
                            </button>
                            <ImgThumbImg
                                src={cardResult.image.path}
                                onClick={(e) => { this.setSelectedIndex(idx) }}
                                alt="Selected Prize Image"
                            />
                            <SetPrize
                                {...this.props}
                                cardResult={cardResult}
                                idx={idx}
                            />
                        </ResultsList>
                    )}
                </ul>
                <Button onClick={() => this.props.setState({ viewSummary: false })}>Close</Button>
            </Modal>
        )
    }
}
export default Summary;