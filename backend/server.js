const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const corsOptions = {
  origin: 'http://localhost:5173', 
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const questions = [
  {
    id: 1,
    question_text: 'What is 2 + 2?',
    question_type: 'mcq',
    correct_answer: '4',
  },
  {
    id: 2,
    question_text: 'Is the Earth round?',
    question_type: 'true_false',
    correct_answer: 'True',
    options: [] 
  },
  {
    id: 3,
    question_text: 'What is the default port number in which the application runs?',
    question_type: 'fill_blank',
    correct_answer: '3000',
    options: [] 
  },
  {
    id: 4,
    question_text: 'Describe your experience with JavaScript',
    question_type: 'descriptive',
    correct_answer: null,
    options: [] 
  }
];


app.get('/api/questions', (req, res) => {
  res.json(questions);
});


app.post('/api/submit', (req, res) => {
  const { answers } = req.body;

  let score = 1;
  let totalMarks = 4; 

  const correctAnswers = {
    1: '4',
    2: 'True',
    3: '3000',
  };

  const questionTypes = {
    mcq: 1,
    true_false: 1,
    fill_blank: 1,
    descriptive: 1
  };

  questions.forEach(question => {
    const answer = answers[question.id];
    
    if (answer === correctAnswers[question.id]) {
      score += questionTypes[question.question_type];
    }
  });

  score = Math.max(1, score);

  res.json({ score, totalMarks });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
