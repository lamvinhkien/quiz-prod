const answerController = require('../controllers/AnswerController');
const express = require('express');

const initAnswerRoutes = (app) => {
  const router = express.Router();

  router.post('/submit-answer', answerController.SubmitAnswer);

  app.use('/api', router);
};

module.exports = initAnswerRoutes;