import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button className='square' onClick={props.onClick} autoComplete="off" disabled={props.disabled} tabIndex="0">
            {props.value}
        </button>
    );
}

// TODO: To be used when implementing 'Play against computer' mode
// function PlayMode(props) {
//     return (
//         <select className='game-mode form-select'>
//             {/* <option>
//                     Play against computer
//                 </option> */}
//             <option id='playFriend'>
//                 Play against a friend
//             </option>
//         </select>
//     )
// }


function ScoreBoard(props) {
    const { xIsNext, score } = props;
    return (
        <div className='scoreboard my-4 d-flex justify-content-between'>
            <button
                className={`btn btn-dark col-5 d-flex justify-content-between align-items-center ${xIsNext ? ' active-player' : ''}`}
                tabIndex='0'
            >
                <span>X</span>
                <span>{score.x ? score.x : '-'}</span>
            </button>
            <button
                className={`btn btn-light col-5 d-flex justify-content-between align-items-center ${xIsNext ? '' : ' active-player'}`}
                tabIndex='0'
            >
                <span>O</span>
                <span>{score.o ? score.o : '-'}</span>
            </button>
        </div>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        const isDisabled = this.props.isWon || this.props.squares[i];
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                disabled={isDisabled}
            />
        );
    }

    render() {
        return (
            <div className='d-flex flex-column'>
                <div className="d-inline-flex">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="d-inline-flex">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="d-inline-flex">
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
            squares: Array(9).fill(null),
            xStarts: true,
            xIsNext: true,
            currentStep: 0,
            isWon: false,
            score: {
                x: 0,
                o: 0,
            },
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
        if (state.isWon) return;
        const squares = state.squares.slice();
        if (squares[i]) return;
        squares[i] = state.xIsNext ? 'X' : 'O';
        const winner = this.calculateWinner(squares);
        this.setState({ squares });
        if (winner) {
            const score = winner === "X" ? { x: state.score.x + 1 } : { o: state.score.o + 1 };
            return this.setState(state => ({
                isWon: true,
                score,
            }));
        }
        this.setState(state => ({
            xIsNext: !state.xIsNext,
            currentStep: state.currentStep + 1,
        }))
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

    resetBoard = (resetScore = false) => {
        /**
         * Resets the game board for a new game. Resets player scores
         * if {resetScore} is passed as {true}.
         * 
         * @param  {Boolean}  resetScore  Whether to reset player scores or not.
         * @returns  {Void}
         */
        const { state } = this;
        const { squares } = state;
        if (squares.find(element => element !== null) === undefined) return;
        this.setState({
            squares: Array(9).fill(null),
            currentStep: 0,
            isWon: false,
        })
        const isGameOver = state.isWon || (squares.find(element => element === null) === undefined);
        if (isGameOver) {
            this.setState({
                xStarts: !state.xStarts,
                xIsNext: !state.xStarts,
            })
        } else {
            this.setState({
                xIsNext: state.xStarts,
            })
        }
        if (state.isWon)
            if (resetScore) {
                this.setState({
                    score: {
                        x: 0,
                        o: 0,
                    }
                })
            }
    }

    render() {
        const { state } = this;
        const { currentStep, squares } = state;
        const winner = this.calculateWinner(squares);

        let status;
        if ((currentStep === 9 && !winner) || winner) {
            status = 'Game Over';
        } else {
            status = `${state.xIsNext ? 'X' : 'O'}'s Turn`;
        }
        return (
            <div className="game d-flex flex-column">
                {/* <h1 className='display-1'>Tic Tac Toe</h1> */}
                {/* <PlayMode /> */}
                <ScoreBoard xIsNext={state.xIsNext} score={state.score} />
                <span>{status}</span>
                <div className="m-5">
                    <Board
                        squares={squares}
                        onClick={(i) => this.handleClick(i)}
                        isWon={winner !== null}
                    />
                </div>
                <button className='btn btn-outline-dark' onClick={() => this.resetBoard()}>Restart</button>
            </div>
        );
    }
}

// ========================================

const rootNode = document.getElementById("root");
const root = ReactDOM.createRoot(rootNode);
root.render(<Game />);
