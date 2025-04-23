import { useState } from 'react';
import '../styles/Games.css';

const TicTacToe = ({ onBack }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (board[i] || winner) return;
    
    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    
    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const isDraw = board.every(square => square) && !winner;

  return (
    <div className="tictactoe-container">
      <div className="game-header">
        <h2 className="game-title">Tic Tac Toe</h2>
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
      </div>

      <div className="game-status">
        {winner ? (
          <p className="winner-message">Player {winner} wins! 🎉</p>
        ) : isDraw ? (
          <p className="winner-message">It's a draw! 🤝</p>
        ) : (
          <p>Next player: <strong>{isXNext ? 'X' : 'O'}</strong></p>
        )}
      </div>

      <div className="board">
        {board.map((square, i) => (
          <button
            key={i}
            className={`cell ${square?.toLowerCase()}`}
            onClick={() => handleClick(i)}
          >
            {square}
          </button>
        ))}
      </div>

      <div className="action-buttons">
        <button className="restart-btn" onClick={resetGame}>
          New Game
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;