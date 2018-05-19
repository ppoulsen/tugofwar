import * as React from 'react';

import './App.css';
import GameSubscription from './components/gameSubscription';
import StartGame from './components/startGame';

class App extends React.Component {
  public render() {
    return (
      <div>
        <StartGame />
        <GameSubscription />
      </div>
    );
  }
}

export default App;
