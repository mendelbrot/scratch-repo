import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import ViewScreen from './ViewScreen';
import Instruments from './Instruments';
import HelmControls from './HelmControls';
import SimContext from '../sim-helpers/SimContext';


const BrLayout = styled.div`
    display: flex;

    .view{
        padding: 20px;
    }

    .helm{
        padding: 0px 20px 20px 20px;
    }

    .inst{
        padding: 20px 2px 20px 0px;
    }
`

function Bridge(props) {

    const context  = useContext(SimContext);

    const [deltaV, setDeltaV] = useState(context.helmDeltaVPreset);
    const [theta, setTheta] = useState(context.helmAnglePreset);
    const [hasPushedReset, setHasPushedReset] = useState(false);

    var reset = () => {
        setDeltaV(context.helmDeltaVPreset)
        setTheta(context.helmAnglePreset)
    }

    if (!hasPushedReset) {
        context.pushFunctionToResetCallbackList(reset);
        setHasPushedReset(true);
    }

    const helmData = {
        deltaV: deltaV,
        setDeltaV: setDeltaV,
        theta: theta,
        setTheta: setTheta,
    }
    
    return (
        <BrLayout>
            <div className='left'>
                <div className='view'>
                    <ViewScreen helmData={helmData}/>
                </div>
                <div className='helm'>
                    <HelmControls helmData={helmData} />
                </div>
            </div>
            <div className='inst'>
                <Instruments />
            </div>
        </BrLayout>
    );
}

export default Bridge;