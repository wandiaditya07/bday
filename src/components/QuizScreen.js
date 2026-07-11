"use client";
import { useState } from 'react';

export default function QuizScreen({ onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  
  const questions = [
    { text: 'Apa makanan favorit kita berdua?', options: ['A. Nasi Goreng', 'B. Mie Ayam', 'C. Sate Ayam', 'D. Martabak'], correct: 0 },
    { text: 'Kapan pertama kali kita bertemu?', options: ['A. Januari 2023', 'B. Februari 2023', 'C. Maret 2023', 'D. April 2023'], correct: 1 }
  ];

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    setTimeout(() => {
      if (index === questions[currentQuestion].correct) {
        if (currentQuestion + 1 < questions.length) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedOption(null);
        } else {
          setShowResult(true);
        }
      } else {
        setSelectedOption(null); // Simple reset if wrong for now
      }
    }, 500);
  };

  return (
    <div className="glass-card" style={{ maxWidth: '500px' }}>
      <h2 className="title" style={{ fontSize: '2rem' }}>Seberapa Kenal Kamu?</h2>
      
      {!showResult ? (
        <>
          <p id="quiz-progress" style={{ marginBottom: '20px', fontWeight: 'bold', color: '#d57eeb' }}>
            Pertanyaan {currentQuestion + 1} / {questions.length}
          </p>
          <div id="quiz-content">
            <p id="question-text" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
              {questions[currentQuestion].text}
            </p>
            <div id="options-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {questions[currentQuestion].options.map((opt, index) => {
                let className = "option-btn";
                if (selectedOption === index) {
                  className += index === questions[currentQuestion].correct ? " correct" : " wrong";
                }
                return (
                  <button key={index} className={className} onClick={() => handleOptionClick(index)}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div id="quiz-result">
          <h3 style={{ fontSize: '1.8rem', color: '#ff9a9e', marginBottom: '15px' }}>Kamu Berhasil! 🎉</h3>
          <p style={{ marginBottom: '20px' }}>Ternyata kamu beneran ingat semua detail kecil tentang kita. I love you!</p>
          <button className="magic-btn" onClick={onClose}>Kembali ❤️</button>
        </div>
      )}
      
      {!showResult && (
        <button className="magic-btn" onClick={onClose} style={{ marginTop: '20px', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', fontSize: '1rem' }}>
          Keluar Kuis
        </button>
      )}
    </div>
  );
}
