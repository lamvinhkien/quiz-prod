const questionController = require('../controllers/QuestionController');
const upload = require('../middleware/multerUpload');
const { checkUserLogin } = require('../middleware/jwtAction');
const express = require('express');

const initQuestionRoutes = (app) => {
    const router = express.Router();

    router.post('/delete-question', checkUserLogin, questionController.DeleteQuestion);
    router.post('/createQuestion-AndAnswer', checkUserLogin, upload.single('questionImg'), questionController.CreateQuestionAndAnswer);
    router.post('/updateQuestion-AndAnswer', checkUserLogin, upload.single('questionImg'), questionController.UpdateQuestionAndAnswer);

    app.use('/api', router);
};

module.exports = initQuestionRoutes;