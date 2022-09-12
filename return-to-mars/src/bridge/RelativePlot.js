import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { VictoryChart, VictoryGroup, VictoryArea, VictoryLine, VictoryAxis, VictoryLabel } from 'victory'
import SimContext from '../sim-helpers/SimContext';


const Plot = styled.div`
`

function RelativePlot(props) {

    const context = useContext(SimContext);

    const initialData = () => {
        var dat = [];
        return dat;
    }

    const [hasPushedResetFunction, setHasPushedResetFunction] = useState(false);

    var reset = () => {
        setTolData(initialData());
        setValData(initialData());
    }

    if (!hasPushedResetFunction) {
        context.pushFunctionToResetCallbackList(reset);
        setHasPushedResetFunction(true);
    }

    const [tolData, setTolData] = useState(initialData());
    const [valData, setValData] = useState(initialData());

    useEffect(() => {
        if(context.playing){
            if (valData.length < props.n) {
                valData.push({ x: props.x, y: props.y });
                tolData.push({ x: props.x, y: props.tol });
            } else {
                for (var i = props.n - 1; i > 0; i--) {
                    valData[i].x = valData[i - 1].x;
                    valData[i].y = valData[i - 1].y;
                    tolData[i].x = tolData[i - 1].x;
                    tolData[i].y = props.tol;
                };

                valData[0].x = props.x;
                valData[0].y = props.y;
                tolData[0].x = props.x;
                tolData[0].y = props.tol;
            }
        }
    });

    var tolColor = props.y > props.tol ? 'magenta': 'lime';
    var width = 400;
    var height =250;

    return (
        <div> 
            {valData.length < 2 ? <div style={{ width: width, height: height }}/> :
                <Plot>
                    <VictoryChart width={width} height={height}>
                        <VictoryAxis
                            orientation='bottom'
                        />
                        <VictoryLabel
                            text={props.xLabel}
                            textAnchor={'middle'}
                            verticalAnchor={'middle'}
                            x={width / 2}
                            y={height * 0.97}
                        />
                        <VictoryAxis
                            dependentAxis
                            orientation='right'
                        />
                        <VictoryLabel
                            text={props.yLabel}
                            textAnchor={'middle'}
                            verticalAnchor={'middle'}
                            angle={-90}
                            x={width * 0.98}
                            y={height / 2}
                        />
                        <VictoryGroup
                            style={{
                                data: { strokeWidth: 3, fillOpacity: 0.4 }
                            }}
                        >
                            <VictoryLine
                                style={{
                                    data: { stroke: 'blue' }
                                }}
                                data={valData}
                            />
                            <VictoryArea
                                style={{
                                    data: { fill: tolColor, stroke: tolColor }
                                }}
                                data={tolData}
                            />
                        </VictoryGroup>
                    </VictoryChart>
                </Plot>
            }
        </div >
        

    );
}

export default RelativePlot;