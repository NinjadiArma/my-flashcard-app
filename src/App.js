import React, { useState } from 'react';
import './styles.css';

function shuffleArray(array) {
  // Fisher-Yates shuffle
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const lines = event.target.result.split('\n');
      const cards = lines
        .map(line => line.trim())
        .filter(line => line)
        .map(line => {
          const [question, answer] = line.split(',');
          return { question: question?.trim(), answer: answer?.trim() };
        })
        .filter(card => card.question && card.answer);
      setFlashcards(cards);
      setCurrent(0);
      setShowAnswer(false);
    };
    reader.readAsText(file);
  };

  const nextCard = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % flashcards.length);
      setShowAnswer(false);
      setAnimating(false);
    }, 400);
  };

  const handleCardClick = () => {
    if (!showAnswer) setShowAnswer(true);
  };

  const goHome = () => {
    setFlashcards([]);
    setCurrent(0);
    setShowAnswer(false);
    setAnimating(false);
  };

  const shuffleCards = () => {
    setFlashcards(prev => shuffleArray(prev));
    setCurrent(0);
    setShowAnswer(false);
    setAnimating(false);
  };

  return (
    <div className="app-bg">
      <header className="premium-header">
        <span className="logo">FlashMe</span>
      </header>
      <main className="main-content">
        {flashcards.length === 0 ? (
          <section className="welcome-section">
            <h1 className="welcome-title">Welcome to FlashMe</h1>
            <p className="welcome-desc">
              Upload your own flashcards and study efficiently.<br />
              <strong>How to prepare your file:</strong>
            </p>
            <ul className="instructions-list">
              <li>
                <span className="simple-step-number">1</span>
                Create a <b>.csv</b> or <b>.txt</b> file.
              </li>
              <li>
                <span className="simple-step-number">2</span>
                Each line: <b>question,answer</b>
              </li>
              <li>
                <span className="simple-step-number">3</span>
                Example:
                <div className="example-box">
                  What is the capital of France?,Paris<br />
                  2+2=?,4<br />
                  Who wrote Hamlet?,Shakespeare
                </div>
              </li>
              <li>
                <span className="simple-step-number">4</span>
                Save and upload the file below.
              </li>
            </ul>
            <div className="upload-area">
              <input
                className="upload-input"
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                id="file-upload"
              />
              <label htmlFor="file-upload" className="upload-label">
                Choose File
              </label>
            </div>
          </section>
        ) : (
          <section className="flashcard-section">
            <div
              className={`premium-flashcard${showAnswer ? ' flipped' : ''}${animating ? ' animating' : ''}`}
              onClick={handleCardClick}
              tabIndex={0}
              style={{ outline: 'none' }}
            >
              <div className="premium-flashcard-inner">
                <div className="premium-flashcard">
                  {showAnswer ? (
                    <div className="premium-flashcard-back">
                      <span className="card-label">ANSWER</span>
                      <span className="card-content">{flashcards[current].answer}</span>
                      <div className="card-index">
                        {current + 1} / {flashcards.length}
                      </div>
                    </div>
                  ) : (
                    <div className="premium-flashcard-front">
                      <span className="card-label">QUESTION</span>
                      <span className="card-content">{flashcards[current].question}</span>
                      <div className="card-index">
                        {current + 1} / {flashcards.length}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="actions-row">
              <button className="premium-btn secondary-btn" onClick={shuffleCards}>
                Shuffle Cards
              </button>
              {!showAnswer ? (
                <button className="premium-btn" onClick={() => setShowAnswer(true)}>
                  Show Answer
                </button>
              ) : (
                <button className="premium-btn" onClick={nextCard} disabled={animating}>
                  Next Card
                </button>
              )}
            </div>
            <div className="actions-row">
              <button className="premium-btn secondary-btn" onClick={goHome}>
                Back to Home
              </button>
            </div>
          </section>
        )}
      </main>
      <footer className="premium-footer">
        &copy; {new Date().getFullYear()} FlashMe. All rights reserved.
      </footer>
    </div>
  );
}

export default App;