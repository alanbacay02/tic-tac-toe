import './App.css';
import PropTypes from 'prop-types';
import { useState } from 'react';

// Creates a function `Square` which accepts props `value`, `onSquareClick`, and `isWinner`.
function Square({value, onSquareClick, isWinner}) {
	// Returns a <button /> where its className will be assigned `winning-square` if props `isWinner` is true and `square` vice-versa. On <button /> click it will call the props function `onSquareClick`, and props `value` is passed in as a label.
	return <button className={isWinner ? 'winning-square': 'square'} onClick={onSquareClick}>{value}</button>;
}
// Validates that the `value` prop is either string or `null`, and the `onSquareClick` prop is a function, and isWinner is a boolean.
Square.propTypes = {
	value: PropTypes.string.isRequired,
	onSquareClick: PropTypes.func.isRequired,
	isWinner: PropTypes.bool
};

// Creates a function `Board` to contain the game board and history of moves.
function Board({ xIsNext, squares, onPlay, winningSquares}) {

	function handleClick(i) {
		// Returns function early if clicked square is filled or a winner has been determined.
		if (squares[i] || calculateWinner(squares)) {
			return;
		}
		// Copies the array in state `squares` and assigns it to `nextSquares`.
		const nextSquares = squares.slice();
		// Checks `xIsNext` where if true or false.
		if (xIsNext) {
			// Assigns `X` value to `nextSquares[i]` if true.
			nextSquares[i] = 'X';
		} else {
			// Assigns `X` value to `nextSquares[i]` if false.
			nextSquares[i] = 'O';
		}
		// Calls props function `onPlay` with updated `nextSquares` array as param.
		onPlay(nextSquares);
	}

	// Calculates the winner for the game board.
	const winner = calculateWinner(squares);
	let status;
	if (winner) {
		// Assigns message to `status` if true.
		status = 'Winner: ' + winner.player;
	} else {
		// Assigns message to `status` if false.
		status = 'Next player: ' + (xIsNext ? 'X' : 'O');
	}

	// Creates an array with 9 `<Square />` items.
	const squareArr = Array.from({length: 9}).map((item, index) => {
		if (winner) {
			// Destructures array from `winningSquares` and assigns it to variables `a`, `b`, and `c`. 
			let [a, b, c] = winningSquares.arr;
			// Checks if the current square is part of the winning combination.
			if (a === index || b === index || c === index) {
				return (
					// Returns a child component `<Square />` where the `isWinner` prop is true if the current square is part of the winning combination.
					<Square isWinner={true} key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />
				);
			}
		}
		return (
			// Returns a child component <Square /> where props `isWinner` is false.
			<Square isWinner={false} key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />
		);
	});
	return (
		<div>
			<div className="status">{status}</div>
			{/* Creates an array with 3 <div /> items and 3 <Square /> items inside each div. */}
			{Array.from({length: 3}).map((item, index) => {
				return (
					<div className="board-row" key={index}>{squareArr.slice(index * 3, (index * 3) + 3)}</div>
				);
			})}
			{/* <div className="board-row">
				<Square value={squares[0]} onSquareClick={() => handleClick(0)} />
				<Square value={squares[1]} onSquareClick={() => handleClick(1)} />
				<Square value={squares[2]} onSquareClick={() => handleClick(2)} />
			</div>
			<div className="board-row">
				<Square value={squares[3]} onSquareClick={() => handleClick(3)} />
				<Square value={squares[4]} onSquareClick={() => handleClick(4)} />
				<Square value={squares[5]} onSquareClick={() => handleClick(5)} />
			</div>
			<div className="board-row">
				<Square value={squares[6]} onSquareClick={() => handleClick(6)} />
				<Square value={squares[7]} onSquareClick={() => handleClick(7)} />
				<Square value={squares[8]} onSquareClick={() => handleClick(8)} />
			</div> */}
		</div>
	);
}
// Validates that the `xIsNext` prop is a boolean value, the `squares` prop is an array, the `onPlay` prop is a function, and `winningSquares` is either an object or an array.
Board.propTypes = {
	xIsNext: PropTypes.bool.isRequired,
	squares: PropTypes.array.isRequired,
	onPlay: PropTypes.func.isRequired,
	winningSquares: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

// Creates a function `Game` to keep track of the overall state of the game and logic.
export default function Game() {
	// Creates state `history` to track game moves.
	const [history, setHistory] = useState([Array(9).fill(null)]);
	// Creates state `currentMove` to track current move in the game.
	const [currentMove, setCurrentMove] = useState(0);
	// Checks if currentMove is odd or even and assigns bool value to xIsNext.
	const xIsNext = currentMove % 2 === 0;
	// Assigns `history` with index `currentMove` to currentSquares.
	const currentSquares = history[currentMove];
	// Creates state `ascending` to track state of game move list order.
	const [ascending, setAscending] = useState(true);
	// Creates const `winningSquares` to track winning squares on the board.
	const winningSquares = calculateWinner(currentSquares);

	function handlePlay(nextSquares) {
		// Creates a copy of history from start to current move to `nextHistory` while adding the next move to the end of the array.
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
		// Update `history` state to `nextHistory` and set `currentMove` to last index of `nextHistory`.
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
	}

	function jumpTo(nextMove) {
		// Sets `currentMove` state to `nextMove`.
		setCurrentMove(nextMove);
	}

	// Maps `history` state to `moves`.
	const moves = history.map((squares, move) => {
		let description;
		if (move > 0) {
			// Assigns string and current move to description.
			description = 'Go to move #' + (move + 1);
		} else {
			// Assigns string if move is less than 0.
			description = 'Go to game start';
		}
		if (move === currentMove) {
			// Returns JSX if `move` is at `currentMove`
			return (
				<li key={move}>
					<p>You are at move #{move + 1}</p>
				</li>
			);
		}
		// Returns JSX if `move` is not at `currentMove`
		return (
			<li key={move}>
				<button onClick={() => jumpTo(move)}>{description}</button>
			</li>
		);
	});

	// Creates function `handleSortClick` to handle onClick for  "button-sort".
	function handleSortClick() {
		// On function call, `ascending` state value is flipped.
		setAscending(!ascending);
	}


	return (
		<div className="game">
			{/* Creates a div "game-board" used to contain <Board /> */}
			<div className="game-board">
				{/* 
				`currentSquares` represents the current state of the game board. 
				`winningSquares` is an optional array prop that is passed the winning combination of squares if it exists, and an empty array if there is no winner.
				`xIsNext` is a boolean prop that determines which player is currently up.
				`handlePlay` is a callback function that is called when a player makes a move on the board.
				*/}
				<Board winningSquares={winningSquares ? winningSquares : []} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
			</div>
			{/* Creates a div "game-info" to contain game move history */}
			<div className="game-info">
				{/* Creates button to allow user to switch between list descending and ascending order */}
				<button className="button-sort" onClick={handleSortClick}>{ascending ? 'Sort by ▼' : 'Sort by ▲ '}</button>
				{/* Renders array `move` based on `ascending` state */}
				<ol>{ascending ? moves : moves.reverse()}</ol>
			</div>
		</div>
	);
}

// Creates a function `calculateWinner` to calculate game winner.
function calculateWinner(squares) {
	// Creates a nested array to store all winning game moves.
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	// Iterates through entire array.
	for (let winningMove of lines) {
		// Destructures array `winningMove` and assigns first, second, and third items to the constants `a`, `b`, and `c`.
		const [a, b, c] = winningMove;
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			// Returns an object where `player` is assigned the winning player and `arr` the winning combination of squares.
			return {player: squares[a], arr: winningMove};
		}
	}
	// Returns `null` value on default.
	return null;
}