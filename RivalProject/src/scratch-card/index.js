import React from 'react'
import throttle from 'lodash.throttle'
// Components
import ScratchCardSC from './scratch-card-sc'
import ScratchCardContentSC from './scratch-card-content-sc'
import CanvasWrapperSC from './canvas-wrapper-sc'
import {getOffset, loadImage} from './utils'
import importBrush from '../images/brush.png';

// accepts only one child as prop
// if children content of this component overflow, it will be hidden
class ScratchCard extends React.Component {
  constructor(props) {
    super(props)
    this.ctx = null
    this.offset = null
    this.radius = 16
    this.xPos = null
    this.yPos = null
    this.state = {
      foregroundRendered: false,
      percentScratched: 0,
      isCleared: false
    }
    // retains same this context for removeEventListener
    this.scratching = this.scratching.bind(this)
  }
  renderForeground() {
    const {imgURL, isCleared} = this.props
    if (!isCleared) {
      const {width, height} = this.refs.canvas
      if (imgURL) {
        const image = new Image()
        image.src = imgURL
        image.crossOrigin = 'Anonymous';
        image.onload = () => {
          this.ctx.drawImage(image, 0, 0, width, height)
          // setState needs to be invoked after the image loads if imgURL exists
          this.setState({foregroundRendered: true})
        }
      } else {
        // default to silver foreground if no image url is provided
        this.ctx.fillStyle = 'silver'
        this.ctx.fillRect(0, 0, width, height)
        this.setState({foregroundRendered: true})
      }
    } else {
      this.setState({foregroundRendered: true})
    }
  }

  updatePos(event) {
    if (event.type === 'mousemove') {
      this.xPos = event.clientX - this.offset.left
      this.yPos = event.clientY - this.offset.top
      return
    }
    if (event.type === 'touchmove') {
      this.xPos = event.touches[0].clientX - this.offset.left - this.radius / 2
      this.yPos = event.touches[0].clientY - this.offset.top - this.radius / 2
    }
  }

  scratching = throttle((event) => {
    event.preventDefault()
    this.offset = getOffset(this.refs.canvas)
    this.updatePos(event)
    this.ctx.globalCompositeOperation = 'destination-out'
    this.ctx.save()
    const {brush} = this.props
    if (brush === 'brush') {
      if (this.brushImage === null || this.brushImage === undefined) {
        let error = new Error('argument img is not a node IMG')
        console.error(error.message)
        return
      }
      let angle = Math.atan2(this.yPos, this.xPos)
      this.ctx.translate(this.xPos, this.yPos)
      this.ctx.rotate(angle)
      this.ctx.drawImage(
        this.brushImage,
        -this.brushImage.width / 2,
        -this.brushImage.height / 2,
        this.brushImage.width * 1.5,
        this.brushImage.height * 1.5
      )
    } else {
      this.ctx.beginPath()
      this.ctx.arc(this.xPos + this.radius, this.yPos + this.radius, this.radius, 0, Math.PI * 2, false)
      this.ctx.fill()
      this.ctx.closePath()
    }
    this.ctx.restore()
    this.updatePercentScratched()
  }, 30)

  updatePercentScratched() {
    let counter = 0
    const {width, height} = this.refs.canvas
    // Sub-rectangle ratio, determines how much outer space within the image
    // is being ignored for percentage cleared calculations
    const {subRectRatio = 1, percentToClear = 50} = this.props
    const imageData = this.ctx.getImageData(
      Math.round(((1 - subRectRatio) / 2) * width),
      Math.round(((1 - subRectRatio) / 2) * height),
      Math.round(subRectRatio * width),
      Math.round(subRectRatio * height)
    )
    const imageDataLength = imageData.data.length
    for (let i = 0; i < imageDataLength; i += 4) {
      if (
        imageData.data[i] === 0 &&
        imageData.data[i + 1] === 0 &&
        imageData.data[i + 2] === 0 &&
        imageData.data[i + 3] === 0
      ) {
        counter++
      }
    }
    const newPercentScratched = Math.round((counter / (subRectRatio * subRectRatio * width * height)) * 10000) / 100
    this.setState({
      percentScratched: newPercentScratched
    })
    if (newPercentScratched >= percentToClear) {
      this.clearCard()
    }
  }

  clearCard() {
    const {onClear = () => {}} = this.props
    this.refs.canvas.removeEventListener('mousedown', this.mouseScratch)
    this.refs.canvas.removeEventListener('touchstart', this.touchScratch)
    window.removeEventListener('resize', this.recalculateOffset)
    window.removeEventListener('scroll', this.recalculateOffset)

    this.setState({isCleared: true})
    onClear()
  }

  mouseScratch = (event) => {
    event.preventDefault()
    const canvas = this.refs.canvas
    const scratching = this.scratching
    canvas.addEventListener('mousemove', scratching)
    document.body.addEventListener('mouseup', function cancelScratch() {
      canvas.removeEventListener('mousemove', scratching)
      document.body.removeEventListener('mouseup', cancelScratch)
    })
  }

  touchScratch = (event) => {
    event.preventDefault()
    const canvas = this.refs.canvas
    const scratching = this.scratching
    canvas.addEventListener('touchmove', scratching)
    document.body.addEventListener('touchend', function cancelScratch() {
      canvas.removeEventListener('touchmove', scratching)
      document.body.removeEventListener('touchend', cancelScratch)
    })
  }

  recalculateOffset = throttle(() => (this.offset = getOffset(this.refs.canvas)), 40)

  componentDidMount() {
    if (this.props.brush === 'brush') {
      loadImage(importBrush).then((image) => {
        this.brushImage = image
      })
    }
    this.ctx = this.refs.canvas.getContext('2d')
    this.renderForeground()
    this.refs.canvas.addEventListener('mousedown', this.mouseScratch)
    this.refs.canvas.addEventListener('touchstart', this.touchScratch)
    window.addEventListener('resize', this.recalculateOffset)
    window.addEventListener('scroll', this.recalculateOffset)
  }

  componentWillUnmount() {
    const {isCleared} = this.state
    // remove event listeners safely if they haven't been removed by this.clearCard()
    if (!isCleared) {
      this.refs.canvas.removeEventListener('mousedown', this.mouseScratch)
      this.refs.canvas.removeEventListener('touchstart', this.touchScratch)
      window.removeEventListener('resize', this.recalculateOffset)
      window.removeEventListener('scroll', this.recalculateOffset)
    }
  }

  render() {
    const {children, height, width} = this.props
    const {foregroundRendered, isCleared} = this.state

    return (
      <div>
        <ScratchCardSC width={`${width}px`} height={`${height}px`}>
          {foregroundRendered && (
            <ScratchCardContentSC display="flex" justifyContent="center" alignItems="center">
              {React.Children.only(children)}
            </ScratchCardContentSC>
          )}
          {!isCleared && (
            <CanvasWrapperSC>
              <canvas
                onContextMenu={(event) => event.preventDefault()}
                ref="canvas"
                width={`${width}px`}
                height={`${height}px`}
              />
            </CanvasWrapperSC>
          )}
        </ScratchCardSC>
      </div>
    )
  }
}

export default ScratchCard
