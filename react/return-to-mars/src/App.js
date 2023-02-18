import React from 'react';
import styled from 'styled-components';
import SimControls from './sim-controls/SimControls'
import Bridge from './bridge/Bridge'
import SimEngine from './sim-helpers/SimEngine'
//import './App.css';

const Main = styled.div`
  display: flex;
  min-width: 100vw;
  min-height: 100vh;

  .sim {
    flex: 1;
    background-color: lightsteelblue;
  }

  .bridge {
    flex: 3;
    background-color: lightyellow;
  }
`

function App() {
  return (
    <Main>
      <SimEngine>
        <div className='sim'>
          <SimControls/>
        </div>
        <div className='bridge'>
          <Bridge/>
        </div>
      </SimEngine>
    </Main>
  );
}

export default App;
