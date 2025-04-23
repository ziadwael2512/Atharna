// src/pages/PopQuiz.jsx
import { useState } from 'react';
import quizQuestions from '../data/Questions'; // Correct import path
import '../styles/Games.css';

const PopQuiz = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (option) => {
    setSelectedOption(option);
    setShowFeedback(true);
    
    const isCorrect = option === quizQuestions[currentIndex].answer;
    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      if (currentIndex < quizQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  if (showResult) {
    return (
      <div className="quiz-result">
        <h2>Quiz Completed!</h2>
        <p className="score-display">Your score: {score}/{quizQuestions.length}</p>
        <div className="feedback-message">
          {score === quizQuestions.length ? (
            <p>Perfect! You're an Egyptian history expert! 🏆</p>
          ) : score >= quizQuestions.length / 2 ? (
            <p>Well done! You know your Egyptian history! 👍</p>
          ) : (
            <p>Keep exploring Egypt's amazing history! 📚</p>
          )}
        </div>
        <div className="action-buttons">
          <button className="restart-btn" onClick={resetQuiz}>
            Try Again
          </button>
          <button className="back-btn" onClick={onBack}>
            ← Back to Games
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentIndex];

  return (
    <div className="quiz-container">
      <div className="game-header">
        <h2 className="game-title">Egyptian Pop Quiz</h2>
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
      </div>

      <div className="question-progress">
        Question {currentIndex + 1} of {quizQuestions.length}
      </div>

      <h3 className="question-text">{currentQuestion.question}</h3>

      <div className="options-grid">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === currentQuestion.answer;
          let btnClass = 'option-btn';
          
          if (showFeedback) {
            if (isSelected) {
              btnClass += isCorrect ? ' correct' : ' incorrect';
            } else if (isCorrect) {
              btnClass += ' correct';
            }
          }

          return (
            <button
              key={index}
              className={btnClass}
              onClick={() => !showFeedback && handleAnswer(option)}
              disabled={showFeedback}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showFeedback && currentQuestion.fact && (
        <div className="fact-feedback">
          <p>💡 {currentQuestion.fact}</p>
        </div>
      )}
    </div>
  );
};

export default PopQuiz;