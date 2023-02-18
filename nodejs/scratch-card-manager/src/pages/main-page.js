import React from 'react'

import ScratchCard from '../scratch-card'
import Flex from '../flex'
import FlexItem from '../flex/flex-item'
import {
  isCleared,
  setCleared,
  setLocalStorage,
  getImageSrc,
  getSessionId
} from '../local-storage'

class MainPage extends React.Component {
  constructor() {
    super()
    this.state = {
      loaded: false,
      isCleared: false
    }
    this.handleCleared = this.handleCleared.bind(this)
  }

  handleCleared() {
    setCleared(true)
  }

  async componentDidMount() {
    const response = await fetch('/prizes', {
      method: 'post',
      body: JSON.stringify({
        sessionId: getSessionId() || ''
      }),
      headers: {'Content-type': 'application/json'}
    })
    const data = await response.json()
    setLocalStorage(data)

    this.setState({loaded: true})
    if (isCleared()) {
      this.setState({isCleared: true})
    }
  }

  render() {
    const {loaded, isCleared} = this.state
    const imgSrc = getImageSrc() || '/background.gif'
    return (
      loaded && (
        <div className="App">
          <header className="App-header">
            <div className="Game">
              <h4 className="card-header">THANKS FOR PARTICIPATING!</h4>
              <Flex>
                <FlexItem margin="sm">
                  <ScratchCard
                    isCleared={isCleared}
                    brush="brush"
                    width={300}
                    height={300}
                    percentToClear={50}
                    subRectRatio={0.7}
                    imgURL="./overlay.gif"
                    onClear={this.handleCleared}
                  >
                    <img
                      width={300}
                      height={300}
                      src={imgSrc}
                      alt="scratch card"
                    />
                  </ScratchCard>
                </FlexItem>
              </Flex>
            </div>
          </header>
        </div>
      )
    )
  }
}

export default MainPage
