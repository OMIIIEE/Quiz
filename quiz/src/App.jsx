import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [totalMarks, setTotalMarks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [theme, setTheme] = useState('light'); // Default theme

  useEffect(() => {
    axios.get('http://localhost:8000/api/questions')
      .then(response => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
        setError('Failed to load questions. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleInputChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    axios.post('http://localhost:8000/api/submit', { answers })
      .then(response => {
        setScore(response.data.score+2);
        setTotalMarks(response.data.totalMarks);
        setSubmitted(true);
      })
      .catch(error => console.error('Error submitting answers:', error));
  };

  const handleEdit = () => {
    setSubmitted(false);
    setAnswers({});
    setScore(null);
    setTotalMarks(null);
  };

  const themes = {
    light: {
      bg: 'bg-gray-100',
      text: 'text-gray-900',
      buttonBg: 'bg-blue-500 hover:bg-blue-600',
      buttonText: 'text-white',
      disabledButton: 'opacity-50 cursor-not-allowed',
      editButton: 'bg-yellow-500 text-black py-2 px-4 rounded hover:bg-yellow-600',
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-gray-300',
      buttonBg: 'bg-white-500 hover:bg-white-600',
      buttonText: 'text-white',
      disabledButton: 'opacity-50 cursor-not-allowed',
      editButton: 'bg-yellow-500 text-black py-2 px-4 rounded hover:bg-yellow-600',
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-900',
      buttonBg: 'bg-indigo-500 hover:bg-indigo-600',
      buttonText: 'text-white',
      disabledButton: 'opacity-50 cursor-not-allowed',
      editButton: 'bg-yellow-500 text-black py-2 px-4 rounded hover:bg-yellow-600',
    },
  };

  useEffect(() => {
    document.body.className = themes[theme].bg;
  }, [theme]);

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

 
  const hardcodedOptions = {
    1: ['1', '2', '3', '4'], 
 
  };

  return (
    <div className={`min-h-screen ${themes[theme].bg} p-4 flex flex-col mx-48 my-12`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className={`${themes[theme].text} text-2xl font-bold`}>Quiz 2.0</h1>
        <div>
        <button onClick={() => handleThemeChange('light')} className={`mr-2 ${themes['light'].buttonText} px-4 py-2 rounded transition-colors duration-300 ${theme === 'light' ? 'bg-blue-500 hover:bg-blue-600' : ''} ${ theme==='blue' ? 'text-black' : ''}`}>
          Light
        </button>
        <button onClick={() => handleThemeChange('dark')} className={`mr-2 ${themes['dark'].buttonText} px-4 py-2 rounded transition-colors duration-300 ${theme === 'dark' ? 'bg-green-500 hover:bg-green-600' : ''} ${theme === 'light' || theme==='blue' ? 'text-black' : ''}`}>
          Dark
        </button>
        <button onClick={() => handleThemeChange('blue')} className={`px-4 py-2 rounded transition-colors duration-300 ${theme === 'blue' ? 'bg-indigo-500 hover:bg-indigo-600' : ''} ${theme === 'dark' ? 'text-white' : ''}`}>
          Blue
        </button>
        </div>
      </div>

      {questions.map((question, index) => (
        <div key={question.id} className={`mb-4 p-4 border rounded shadow-md ${themes[theme].bg}`}>
          <h3 className={`${themes[theme].text} text-lg font-semibold mb-2`}>
            Question {index + 1}: {question.question_text}
          </h3>
          {question.question_type === 'mcq' ? (
            <div className="flex flex-col">
              {hardcodedOptions[question.id] && hardcodedOptions[question.id].map((option, optionIndex) => (
                <label key={optionIndex} className={`mb-2 ${theme==='dark' ? 'text-white' : ""}`}>
                  <input
                    type="radio"
                    name={`question${index}`}
                    value={option}
                    onChange={() => handleInputChange(question.id, option)}
                    className={`mr-2 ${themes[theme].text}`}
                  />
                  {option}
                </label>
              ))}
            </div>
          ) : question.question_type === 'true_false' ? (
            <div className="flex">
              <label className={`mb-4 ${theme==='dark' ? 'text-white' : ""}`}>
                <input
                  type="radio"
                  name={`question${index}`}
                  value="True"
                  onChange={() => handleInputChange(question.id, 'True')}
                  className={`mr-2 ${themes[theme].text}`}
                />
                True
              </label >
              <label className={`mb-4 ml-4 ${theme==='dark' ? 'text-white' : ""}`}>
                <input
                  type="radio"
                  name={`question${index}`}
                  value="False"
                  onChange={() => handleInputChange(question.id, 'False')}
                  className={`mr-2 ${themes[theme].text}`}
                />
                False
              </label>
            </div>
          ) : question.question_type === 'fill_blank' ? (
            <input
              type="text"
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className={`border rounded p-2 w-full ${themes[theme].text}`}
            />
          ) : question.question_type === 'descriptive' ? (
            <textarea
              maxLength="50"
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className={`border rounded p-2 w-full ${themes[theme].text}`}
            />
          ) : null}
        </div>
      ))}

      <div className={`mt-4 ${themes[theme].bg}`}>
        {submitted ? (
          <div>
            <button
              onClick={handleEdit}
              className={`${themes[theme].editButton}`}
            >
              Edit
            </button>
            <h2 className={`${themes[theme].text} mt-4 text-lg font-semibold`}>Total Marks: {totalMarks}</h2>
            <h2 className={`${themes[theme].text} mt-2 text-lg font-semibold`}>Your score: {score} out of {totalMarks}</h2>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            className={`${themes[theme].buttonBg} ${themes[theme].buttonText} py-2 px-4 rounded hover:${themes[theme].buttonText} transition-colors duration-300`}
            disabled={submitted}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
