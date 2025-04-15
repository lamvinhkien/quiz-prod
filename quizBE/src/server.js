require('dotenv').config()
const express = require('express');
const path = require('path');
const initQuizRoutes = require('./routes/QuizRoute.js');
const initAdminRoutes = require('./routes/AdminRoute.js');
const initQuestionRoutes = require('./routes/QuestionRoute.js');
const initAnswerRoutes = require('./routes/AnswerRoute.js');
const initCategoryRoutes = require('./routes/CategoryRoute.js');
const configCors = require('./config/cors.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const app = express()

app.use('/uploads', express.static(path.join(__dirname, './public/uploads')));

configCors(app)

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(cookieParser())

initQuizRoutes(app)
initAdminRoutes(app)
initQuestionRoutes(app)
initAnswerRoutes(app)
initCategoryRoutes(app)

app.listen(process.env.PORT, () => {
  console.log('>>> Server running on PORT:', process.env.PORT)
})