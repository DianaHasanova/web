import React, { useState } from "react";
import { questions, colorTypeMap } from "../colorTypeTestData";
import api from '../api';

function ColorTypeTest() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [ambiguousTypes, setAmbiguousTypes] = useState([]);
  const [result, setResult] = useState(null);
  const token = localStorage.getItem('token');

  const sendResultToServer = async (colorType) => {
    try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
    
        const response = await api.post('/customer/color-type', { colorType }, { headers });
        console.log('Результат успешно отправлен:', response.data);
      } catch (error) {
        console.error('Ошибка при отправке результата:', error);
      }
  };

  const calculateScores = (ans, qs) => {
    const scores = { 0: 0, 1: 0, 2: 0, 3: 0 };
    for (const q of qs) {
      const answer = ans[q.id];
      if (!answer) continue;
      const option = q.options.find(o => o.text === answer);
      if (option) {
        option.types.forEach(t => {
          scores[t]++;
        });
      }
    }
    return scores;
  };

  const checkAmbiguity = (scores) => {
    const maxScore = Math.max(...Object.values(scores));
    const leaders = Object.entries(scores)
      .filter(([_, score]) => score === maxScore)
      .map(([type]) => Number(type));
    return leaders.length > 1 ? leaders : null;
  };

  const handleOptionChange = (optionText) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: optionText }));
  };

  const handleNext = () => {
    if (!answers[currentIndex]) return;

    if (currentIndex === 3) {
      const scores = calculateScores(answers, questions.slice(0, 4));
      const ambiguous = checkAmbiguity(scores);

      if (ambiguous) {
        setAmbiguousTypes(ambiguous);
        setCurrentIndex(4);
      } else {
        const winner = Number(Object.entries(scores).find(([_, score]) => score === Math.max(...Object.values(scores)))[0]);
        setResult(winner);
        sendResultToServer(winner); //sendResultToServer(colorTypeMap[winner]);
      }
    } else if (currentIndex === 4) {
      const selectedOption = questions[4].options.find(o => o.text === answers[4]);
      if (selectedOption) {
        setResult(selectedOption.types[0]);
        sendResultToServer(selectedOption.types[0]);//sendResultToServer(colorTypeMap[selectedOption.types[0]]);
      }
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (result !== null) {
    return (
      <div className="color-type-test-result">
        <h2>Ваш цветотип: {colorTypeMap[result]}</h2>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const optionsToShow = currentIndex === 4 && ambiguousTypes.length > 0
    ? currentQuestion.options.filter(opt => ambiguousTypes.includes(opt.types[0]))
    : currentQuestion.options;

  return (
    <div>
      <h3 className="color-type-test-question">{currentQuestion.text}</h3>

      {optionsToShow.map(opt => (
        <label key={opt.text} className="color-type-test-option">
          <input
            type="radio"
            name={`q${currentQuestion.id}`}
            checked={answers[currentIndex] === opt.text}
            onChange={() => handleOptionChange(opt.text)}
          />
          <span>{opt.text}</span>
        </label>
      ))}

      <button
        className="btn-add-product"
        onClick={handleNext}
        disabled={!answers[currentIndex]}
      >
        {currentIndex === 4 ? "Показать результат" : "Следующий"}
      </button>
    </div>
  );
}

export default ColorTypeTest;
