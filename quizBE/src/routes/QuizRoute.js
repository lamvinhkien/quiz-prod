const quizController = require('../controllers/QuizController');
const { checkUserLogin } = require('../middleware/jwtAction');
const express = require('express');

const initQuizRoutes = (app) => {
  const router = express.Router();

  router.post('/getAll-quiz', quizController.GetAllQuiz);
  router.post('/getQuiz-Question-Answer', quizController.GetQuizQuestionAnswer);
  router.post('/create-quiz', checkUserLogin, quizController.CreateQuiz);
  router.post('/update-quiz', checkUserLogin, quizController.UpdateQuiz);
  router.post('/delete-quiz', checkUserLogin, quizController.DeleteQuiz);
  router.post('/getAll-quiz-pagination-Admin', checkUserLogin, quizController.GetAllQuizPagination);
  router.post('/getAll-quiz-Admin', checkUserLogin, quizController.GetQuizAdmin);
  router.post('/getQuiz-Question-Answer-Admin', checkUserLogin, quizController.GetQuestionAnswerAdmin);

  app.use('/api', router);
};

module.exports = initQuizRoutes;