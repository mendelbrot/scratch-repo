import React, { createRef, useEffect } from 'react';

function HelmWheel(props) {

    const bgColor = 'saddlebrown';

    const WrapperStyle = {
        backgroundColor: bgColor,
        padding: 10,
        borderRadius: 20,
        marginRight: 20,
    };

    const canvasRef = createRef();

    useEffect(() => {
        // initialize the canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.rect(0, 0, props.width, props.width);
        ctx.fillStyle = bgColor;
        ctx.fill();
        ctx.save();
        const shw = 0.5 * props.width;
        ctx.translate(shw, shw);     //origin at the center
        ctx.scale(1, -1);            //flip the y axis to correspond to math convention

        // draw the background
        ctx.beginPath();
        ctx.arc(0, 0, shw, 0, 2 * Math.PI);
        ctx.fillStyle = 'orange';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.stroke();

        // draw the heading line
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0.7 * shw * Math.cos(props.helmData.theta), 0.7 * shw * Math.sin(props.helmData.theta));
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.restore();
    });

    const setNewHeading = (e) => {
        const offsetX = canvasRef.current.offsetLeft;
        const offsetY = canvasRef.current.offsetTop;
        const x = e.pageX - offsetX - props.width / 2;
        const y = -(e.pageY - offsetY - props.width / 2);
        const theta = Math.atan2(y, x);
        props.helmData.setTheta(theta);
    }

    return (
        <div style={WrapperStyle}>
            <canvas 
                ref={canvasRef} 
                onClick={setNewHeading} 
                onMouseMove={(e) => {
                    if(e.buttons !== 0) {
                        setNewHeading(e);
                    }
                }} 
                width={props.width} 
                height={props.width}/>
        </div>
    );
}

export default HelmWheel;