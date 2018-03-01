import React from 'react';
import patternList from './pattern_list';
import GameBoard from './game_board';

const sizes = {"small": [30, 50], "medium": [40, 60], "large": [60, 100]};
const speeds = {"slow": 500, "medium": 200, "fast": 1};

export default class GameDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {game: new GameBoard(sizes["medium"][0], sizes["medium"][1], () => {return Math.random() < 0.5 ? 1 : 0;}), size: "medium", speed: "fast", runningQ: false, generations: 0};
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.clearBoard = this.clearBoard.bind(this);
  }

  start() {
    this.timerID = setInterval(() => this.setState({game: this.state.game.advanceStep(), generations: this.state.generations + 1}), speeds[this.state.speed]);
    this.setState({runningQ: true});
  }

  pause() {
    clearInterval(this.timerID);
    this.setState({runningQ: false});
  }

  addPoint(i, j) {
    this.setState({game: this.state.game.addPoint(i, j)});
  }

  resetRandom(size) {
    if (size == this.state.size)
      return;

    clearInterval(this.timerID);
    this.setState({game: new GameBoard(sizes[size][0], sizes[size][1], () => {return Math.random() < 0.5 ? 1 : 0;}), size: size, runningQ: false, generations: 0});
  }

  randomize() {
    clearInterval(this.timerID);
    this.setState({game: new GameBoard(sizes[this.state.size][0], sizes[this.state.size][1], () => {return Math.random() < 0.5 ? 1 : 0;}), size: this.state.size, runningQ: false, generations: 0});
  }

  setPattern(patternIndex) {
    clearInterval(this.timerID);
    this.setState({game: GameBoard.createPattern(sizes[this.state.size][0], sizes[this.state.size][1], patternIndex), runningQ: false, generations: 0});
  }

  setSpeed(speed) {
    if (speed == this.state.speed)
      return;

    // stop the game
    clearInterval(this.timerID);
    // if game state is running, then give it a "kick start" at the new speed
    if (this.state.runningQ)
      this.timerID = setInterval(() => this.setState({game: this.state.game.advanceStep(), generations: this.state.generations + 1}), speeds[speed]);

    this.setState({speed: speed});
  }

  clearBoard() {
    clearInterval(this.timerID);
    this.setState({game: new GameBoard(sizes[this.state.size][0], sizes[this.state.size][1], () => 0), runningQ: false, generations: 0});
  }
  
  render() {
    const rows = this.state.game.board.map((row, i) => {
      const cols = row.map((col, j) => {
        const style = {
          backgroundColor: (this.state.game.board[i][j] ? "green" : "black")
        };

        return <td style={style} onClick={() => this.addPoint(i, j)} key={i + " " + j}></td>;
      });

      return <tr key={i}>{cols}</tr>;
    });

    const sizeButtons = ["small", "medium", "large"].map((size) => {
      const style = {border: "2px solid black"};
      
      return <button style={size == this.state.size ? style : null} onClick={() => this.resetRandom(size)} key={size}>{"Size: " + sizes[size][0] + "x" + sizes[size][1]}</button>;
    });

    const patternButtons = patternList.map((pattern, patternIndex) => {
      return <button onClick={() => this.setPattern(patternIndex)} key={pattern.name}>{pattern.name}</button>;
    });

    const speedButtons = ["slow", "medium", "fast"].map((speed) => {
      const style = {border: "2px solid black"};
      
      return <button style={speed == this.state.speed ? style : null} onClick={() => this.setSpeed(speed)} key={speed}>{speed}</button>;
    });
    
    return (
      <div className="game-display">
        <div className="generations">{"Generations: " + this.state.generations}</div>
        <table><tbody>{rows}</tbody></table>
        <div>
          <div className="buttons">
            <button onClick={this.state.runningQ ? this.pause : this.start} className="start-pause">{this.state.runningQ ? "Pause" : "Start"}</button>
            <span>{sizeButtons}</span>
            <button onClick={() => this.randomize()}>Randomize</button>
            <button onClick={this.clearBoard}>Clear</button>
          </div>
        </div>
        <div>
          <div className="buttons">
            {patternButtons}
          </div>
        </div>
        <div>
          <div className="buttons">
            {speedButtons}
          </div>
        </div>
      </div>
    );
  }
}

