import React from 'react';
import SimContext from '../sim-helpers/SimContext';
import ship from '../images/rocket.png'


class ViewScreen extends React.Component {

    static contextType = SimContext;

    // view-screen width
    width = 500; //window.innerWidth / 3;  

    //canvas objects
    canvas = null;
    ctx = null;
    ship = null;

    componentDidMount = () => {

        this.initializeCanvas();

    }

    componentDidUpdate = () => {
        this.drawBackground();
        this.drawMars();
        this.drawShip();
    }

    initializeCanvas = () => {
        this.canvas = this.refs.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.ship = this.refs.ship
        let shw = 0.5 * this.width;
        this.ctx.translate(shw, shw);     //origin at the center
        this.ctx.scale(1, -1);            //flip the y axis to correspond to math convention
    }

    drawBackground = () => {
        // draw ViewScreen
        let shw = 0.5 * this.width;
        let d = 0.5 * shw;
        this.ctx.beginPath();
        this.ctx.moveTo(-shw, d);
        this.ctx.quadraticCurveTo(-shw, shw, -d, shw);
        this.ctx.lineTo(d, shw);
        this.ctx.quadraticCurveTo(shw, shw, shw, d);
        this.ctx.lineTo(shw, -d);
        this.ctx.quadraticCurveTo(shw, -shw, d, -shw);
        this.ctx.lineTo(-d, -shw);
        this.ctx.quadraticCurveTo(-shw, -shw, -shw, -d);
        this.ctx.closePath();
        this.ctx.fillStyle = 'black';
        this.ctx.fill();

        // draw sun
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.rescale(0.7 * Math.pow(10, 11)), 0, 2 * Math.PI);
        this.ctx.fillStyle = 'yellow';
        this.ctx.fill();
        this.ctx.strokeStyle = 'orange';
        this.ctx.stroke();
    }

    drawMars = () => {
        let marsX = this.rescale(this.context.marsPosition[0]);
        let marsY = this.rescale(this.context.marsPosition[1]);
        this.ctx.beginPath();
        this.ctx.arc(marsX, marsY, this.rescale(0.5 * Math.pow(10, 11)), 0, 2 * Math.PI);
        this.ctx.fillStyle = 'firebrick';
        this.ctx.fill();
        this.ctx.strokeStyle = 'lightseagreen';
        this.ctx.stroke();
    }

    drawShip = () => {
        let shipX = this.rescale(this.context.shipPosition[0]);
        let shipY = this.rescale(this.context.shipPosition[1]);
        let shipWidth = 40;
        this.ctx.save();
        this.ctx.translate(shipX, shipY);
        this.ctx.rotate(this.props.helmData.theta + Math.PI / 2);
        this.ctx.drawImage(this.ship, -shipWidth / 2, -shipWidth / 2, shipWidth, shipWidth)
        this.ctx.restore();
        // if the ship image isn't avaliable yet, call this function back when it is
        this.ship.onload = this.drawShip;
    }

    // rescale distances in km to distances in px that fit in the viewscreen
    rescale = (valueKm) => {
        let maxDistFromCanvasCenter = this.width/2 - 20;
        let scaleFactor = maxDistFromCanvasCenter / this.context.maxDistance;
        return scaleFactor * valueKm;
    }

    render() {
        return (
            <div>
                <canvas ref='canvas' width={this.width} height={this.width} />
                <div>
                    <img ref='ship' src={ship} alt='ship' style={{display:'none'}} />
                </div>
            </div>
        );
    }
}

export default ViewScreen;