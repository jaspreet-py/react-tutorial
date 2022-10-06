import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            currentStep: 0,
        }
    }

    handleClick = (i) => {
        /**
         * Updates state of squares and next player status
         * 
         * @param {Number} i Index of the clicked square
         * @returns {Void}
         */
        // Return early if a winner is decided or the square
        // has already been filled
        const { state } = this;
        const { xIsNext, currentStep } = state;
        const history = state.history.slice(0, currentStep + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winner = this.calculateWinner(squares);
        if (winner || squares[i]) return;
        squares[i] = xIsNext ? 'X' : 'O';
        this.setState({
            history: [...history, { squares }],
            xIsNext: !xIsNext,
            currentStep: history.length,
        });
    }

    calculateWinner = (squares) => {
        /**
         * Takes a state of squares and determines if a player has won or not.
         * 
         * @param  {Array}  squares  Array of squares representing a state of the game
         * @returns  {String|null}  Player name or null if the game has not been won yet
         */
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (const line of lines) {
            const [a, b, c] = line;
            if (
                squares[a] &&
                squares[a] === squares[b] &&
                squares[a] === squares[c]
            ) {
                return squares[a];
            }
        }
        return null;
    }

    jumpTo = (step) => {
        /**
         * Jump to the given step/move of the game.
         * Updates the 'currentStep' and 'xIsNext' state of the component
         */
        this.setState({
            currentStep: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const { state } = this;
        const { history, currentStep } = state;
        const current = history[currentStep];
        const winner = this.calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const description = move ? `Go to move ${move}` : 'Go to start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{description}</button>
                </li>
            )
        })

        let status;
        if (winner) {
            status = `Winner: ${winner}`;
        } else {
            status = `Next player: ${state.xIsNext ? "X" : "O"}`;
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const rootNode = document.getElementById("root");
const root = ReactDOM.createRoot(rootNode);
root.render(<Game />);
