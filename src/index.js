import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CardDeck, Jumbotron } from 'reactstrap';

import TimerCard from './timerCard';

class App extends React.Component {
  state = {
    players: [
      { playerName: 'Ethan', isRunning: false },
      { playerName: 'Tyler', isRunning: false },
      { playerName: 'Nick', isRunning: false },
      { playerName: 'DieLawn', isRunning: false },
      { playerName: 'Keith', isRunning: false },
      { playerName: 'Katlyn', isRunning: false },
      { playerName: 'Etta', isRunning: false },
      { playerName: 'Mark', isRunning: false },
    ],
    isDrinking: false,
    drinkingPlayerName: null,
    paused: true,
    activePlayer: 0,
    direction: 1,
  };

  constructor() {
    super();
    this.setStatePromise = (...args) => new Promise(resolve => this.setState(...args, resolve));
  }

  pauseAllPlayers() {
    const stoppedPlayers = _.map(this.state.players, player => _.merge(player, { isRunning: false }));
    return this.setStatePromise({ players: stoppedPlayers });
  }

  startActivePlayer() {
    const updatedState = _.cloneDeep(this.state);
    _.set(updatedState, ['players', this.state.activePlayer, 'isRunning'], true);
    _.set(updatedState, 'isDrinking', false);
    _.set(updatedState, 'paused', false);
    return this.setStatePromise(updatedState);
  }

  getNextDirection() {
    if (this.state.activePlayer === 0) {
      return 1;
    } else if (this.state.activePlayer === this.state.players.length - 1) {
      return -1;
    }
    return this.state.direction;
  }

  getNextActivePlayerIndex() {
    const newDirection = this.getNextDirection();
    return this.state.activePlayer + newDirection;
  }

  async nextPlayer() {
    const newDirection = this.getNextDirection();
    await this.setStatePromise({ isDrinking: false, direction: newDirection, activePlayer: this.getNextActivePlayerIndex() });
    await this.pauseAllPlayers();
    await this.startActivePlayer();
  }

  async drink(drinkingPlayerName) {
    await this.pauseAllPlayers()
    await this.setStatePromise({ isDrinking: true, drinkingPlayerName });
    this.slurp.play();
  }

  async onKeyDown(event) {
    switch( event.keyCode ) {
      case 80:
        await this.setStatePromise({ paused: true });
        await this.pauseAllPlayers();
        break;
      case 83:
        await this.startActivePlayer();
        break;
      case 32:
        await this.nextPlayer();
        break;
      default:
        break;
    }
  }

  componentWillMount() {
    document.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown.bind(this));
  }

  renderJumbotronContent() {
    const currentPlayer = _.get(this, ['state', 'players', _.get(this, 'state.activePlayer'), 'playerName']);
    const nextPlayer = _.get(this, ['state', 'players', this.getNextActivePlayerIndex(), 'playerName']);
    if (this.state.isDrinking) {
      return (
        <div>
          <h1 className="text-danger">{this.state.drinkingPlayerName} needs a DRINK!</h1>
        </div>);
    } else if (this.state.paused) {
      return (
        <div>
          <h1>Paused</h1>
          <h3 className="text-muted">Current selection: {currentPlayer}</h3>
        </div>);
    } else {
      return (
        <div>
          <h1>On The Clock: {currentPlayer}</h1>
          <h3 className="text-muted">Next up: {nextPlayer}</h3>
        </div>
      );
    }
  }

  render() {
    const timers = _.map(
      this.state.players,
      player => <TimerCard key={player.playerName} playerName={player.playerName} isRunning={player.isRunning} drink={this.drink.bind(this, player.playerName)} />,
    );

    return (
      <div className="App">
        <audio ref={(slurp) => { this.slurp = slurp; }}>
          <source src="/slurp.mp3" type="audio/mpeg" >
          </source>
        </audio>
        <Jumbotron>
          {this.renderJumbotronContent()}
        </Jumbotron>
        <CardDeck>
          {timers}
        </CardDeck>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);