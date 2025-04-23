// src/components/GameSelection.jsx
import { useState } from 'react';
import PopQuiz from './PopQuiz';
import TicTacToe from './TicTacToe';
import '../styles/Games.css';  
import { FaLandmark, FaGamepad } from 'react-icons/fa';

const GameSelection = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <div className="game-selection-screen">
      {!selectedGame ? (
        <>
          <h1 className="game-selection-title">Explore Ancient Egypt</h1>
          <p className="game-selection-subtitle">
            Test your knowledge of pharaohs and pyramids through our interactive games
          </p>
          
          <div className="game-options">
            <div className="game-option-card">
              <div className="game-option-icon">
                <FaLandmark />
              </div>
              <h3 className="game-option-title">Egyptian Pop Quiz</h3>
              <p className="game-option-desc">
                Answer trivia questions about ancient monuments, rulers, and artifacts
              </p>
              <button 
                className="game-option-btn"
                onClick={() => setSelectedGame('quiz')}
              >
                Start Quiz
              </button>
            </div>
            
            <div className="game-option-card">
              <div className="game-option-icon">
                <FaGamepad />
              </div>
              <h3 className="game-option-title">Tic Tac Toe</h3>
              <p className="game-option-desc">
                Play the classic game with Egyptian-themed X and O symbols
              </p>
              <button 
                className="game-option-btn"
                onClick={() => setSelectedGame('tictactoe')}
              >
                Play Game
              </button>
            </div>
          </div>
        </>
      ) : selectedGame === 'quiz' ? (
        <PopQuiz onBack={() => setSelectedGame(null)} />
      ) : (
        <TicTacToe onBack={() => setSelectedGame(null)} />
      )}
    </div>
  );
};

export default GameSelection;