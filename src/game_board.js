import patternList from './pattern_list';

export default class GameBoard {
  constructor(rows, cols, func) {
    this.board = new Array(rows).fill(null);
    for (let i = 0; i < rows; i++) {
      this.board[i] = [];
      for (let j = 0; j < cols; j++) {
        this.board[i].push(func(i, j));
      }
    }

    this.rows = rows;
    this.cols = cols;
  }

  // functions for board creation and modification...
  static createPattern(rows, cols, patternIndex) {
    const game = new GameBoard(rows, cols, () => 0);

    patternList[patternIndex].points.map((point) => {
      game.addPoint(point[0], point[1]);
    });

    return game;
  }

  addPoint(row, col) {
    this.board[row][col] = (this.board[row][col] ? 0 : 1);
    return this;
  }

  // functions for advancing step...
  modulus(n, m) {
    return ((n % m) + m) % m;
  }

  tallyNeighbors(i, j) {
    let total = 0;

    for (let I = i - 1; I <= i + 1; I++) {
      for (let J = j - 1; J <= j + 1; J++) {
        total += this.board[this.modulus(I, this.rows)][this.modulus(J, this.cols)];
      }
    }

    return total - this.board[i][j];
  }
  
  advanceStep() {
    let newBoard = new Array(this.rows).fill(null);
    for (let i = 0; i < this.rows; i++) {
      newBoard[i] = [];
      for (let j = 0; j < this.cols; j++) {
        const neighbors = this.tallyNeighbors(i, j);

        if (this.board[i][j] == 1) { // live cell
          if (neighbors < 2) // underpopulation
            newBoard[i].push(0);
          else if (neighbors > 3) // overpopulation
            newBoard[i].push(0);
          else // live cell lives on
            newBoard[i].push(1);
        }
        else { // dead cell
          if (neighbors == 3) // reproduction
            newBoard[i].push(1);
          else // nothing happening in dead cell
            newBoard[i].push(0);
        }
      }
    }

    this.board = newBoard;
    return this;
  }
}

