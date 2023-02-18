import React from 'react'
import styled from 'styled-components';


export const PanelBox = styled.div`
    min-width: 100px;
    min-height: 100px;
    background-color: grey;
    border-radius: 20px;
    padding: 20px;
`

const Display = styled.div`

    width: 80px;
    display: flex;
    padding: 5px;
    border: solid 1px saddlebrown;
    border-radius: 5px;
    background-color: orange;

    .lcd-display {
        flex: 1;
        font-family: 'alarm-clock';
        font-size: 1.5em;
        font-weight: bold;
    }
`

export const LcdDisplay = (props) => {
    return (
        <Display>
            <span className='lcd-display'>{props.text}</span>
        </Display>
    )
}