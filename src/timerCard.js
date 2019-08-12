import React from 'react';
import leftPad from 'left-pad';
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';


const DRINK_MS = 120000;

class TimerCard extends React.Component {
  state = {
    runningTime: 0,
    nextDrinkTime: DRINK_MS,
  };

  pause() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  checkDrink() {
    if (this.state.runningTime >= this.state.nextDrinkTime) {
      this.setState({ nextDrinkTime: this.state.nextDrinkTime + DRINK_MS }, this.props.drink);
    }
  }

  start() {
    if (!this.timer) {
      const startTime = Date.now() - this.state.runningTime;
      this.timer = setInterval(() => {
        this.setState({ runningTime: Date.now() - startTime }, this.checkDrink.bind(this));
      }, 500);
    }
  }

  startOrPause(isRunning) {
    if (isRunning) {
      this.start();
    } else {
      this.pause();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isRunning !== nextProps.isRunning) {
      this.startOrPause(nextProps.isRunning);
    }
  }

  render() {
    const minutes = Math.trunc(this.state.runningTime / 60000);
    const seconds = leftPad(Math.trunc(this.state.runningTime / 1000) % 60, 2, 0);
    return (
      <Card color={this.props.isRunning ? 'info' : 'secondary'}>
        <CardBody>
          <CardTitle>{minutes}:{seconds}</CardTitle>
          <CardText>
            {this.props.playerName}
          </CardText>
        </CardBody>
      </Card>
    )
  }
}

export default TimerCard;
