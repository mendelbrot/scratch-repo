import React, {useContext} from 'react';
import styled from 'styled-components';
import { Input, Button, Form, FormGroup, Label } from 'reactstrap'
import SimContext from '../sim-helpers/SimContext';


const SinCon = styled.div`

    height: 100vh;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    .top {

        .title {

            padding: 10px 10px 0px 10px;
            h1 {
                font-family: 'marvin-visions';
            }
        }

        .play-controls {
            display: flex;

            > * {
                margin: 10px 10px 10px 0px;
            }

            .speed {
                margin-left: 10px;
            }

            .speed {
                width: 70px;
            }
        }

        .intro {
            padding: 10px 10px 0px 10px;
        }
    }

    .bottom {

        .settings-header {
            border: 1px solid black;
            border-left: none;
            border-right: none;
            padding: 0px 10px 0px 10px;

            h2 {
                font-size: 1.5em;
            }
        }

        .settings-form {
            padding: 10px 10px 10px 10px;
        }
    }

    
`

const SimControls = (props) => {

    const context = useContext(SimContext);

    const eventFunctions = {

        getSpeed: () => {
            return context.secondsPerMarsYear
        },
        setSpeed: (val) => {
            context.setSecondsPerMarsYear(val);
        },

        getDistanceTolerance: () => {
            return context.distanceTolerance / 1000000000;
        },
        setDistanceTolerance: (val) => {
            context.setDistanceTolerance(val * 1000000000);
        },

        getSpeedTolerance: () => {
            return context.speedTolerance / 1000;
        },
        setSpeedTolerance: (val) => {
            context.setSpeedTolerance(val * 1000);
        },

        getInitialDeltaVReserve: () => {
            return context.initialDeltaVReserve / 1000;
        },
        setInitialDeltaVReserve: (val) => {
            context.setInitialDeltaVReserve(val * 1000);
        },

        getTimeLimit: () => {
            return context.timeLimit;
        },
        setTimeLimit: (val) => {
            context.setTimeLimit(val);
        },


    }

    const handleChange = (evt) => {
        eventFunctions[evt.target.name](Number(evt.target.value));
    }

    return (
        <SinCon>
            <div className='top'>
                <div className='title'>
                    <h1>Return to Mars</h1>
                </div>
                <div className='play-controls'>
                    <div className='speed'>
                        <Input
                            name='setSpeed'
                            value={eventFunctions.getSpeed()}
                            min={1} max={60} type="number" step="1"
                            onChange={handleChange}
                        />
                    </div>
                    <Button color='success' onClick={context.playSim}>Play</Button>
                    <Button color='success' onClick={context.pauseSim}>Pause</Button>
                    <Button color='info' onClick={context.resetSim}>Reset</Button>
                </div>
                <div className='intro'>
                    <p>
                        You are piloting a space ship that was on a mission beyond the orbit of Mars 
                        when a collision with a micro-asteroid permanently disabled your comm and main navigation computer.  
                        To survive, you will need to pilot your ship back to Mars before life support runs out.  
                    </p>
                </div>
            </div>

            <div className='bottom'>
                <div className='settings-header'>
                    <h2>Settings</h2>
                </div>
                <div className='settings-form'>
                    <Form>
                        <FormGroup>
                            <Label>Distance Tolerance (Million Km)</Label>
                            <Input
                                name='setDistanceTolerance'
                                value={eventFunctions.getDistanceTolerance()}
                                min={0} type="number" step="1"
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Speed Tolerance (Km/s)</Label>
                            <Input
                                name='setSpeedTolerance'
                                value={eventFunctions.getSpeedTolerance()}
                                min={0} type="number" step="1"
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Initial Reserve (km/s)</Label>
                            <Input
                                name='setInitialDeltaVReserve'
                                value={eventFunctions.getInitialDeltaVReserve()}
                                min={0} type="number" step="0.1"
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Time Limit (Martian Years)</Label>
                            <Input
                                name='setTimeLimit'
                                value={eventFunctions.getTimeLimit()}
                                min={0} type="number" step="1"
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <Button color='info' onClick={context.restoreDefaultValues}>Restore Default</Button>
                    </Form>
                </div>
            </div>

        </SinCon>

    );
    
}

export default SimControls;