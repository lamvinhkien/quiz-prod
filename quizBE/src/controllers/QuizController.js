const quizService = require('../services/QuizService.js');

const CreateQuiz = async (req, res) => {
    try {
        let reqData = {
            name: req.body.name,
            time: req.body.time,
            numOfCorrect: req.body.numOfCorrect,
            categoryId: req.body.categoryId
        }

        if (!reqData.name || !reqData.categoryId || !reqData.time || !reqData.numOfCorrect) {
            return res.json({ error: 1, message: 'Vui lòng nhập đầy đủ thông tin.', data: '' })
        }

        let quiz = await quizService.handleCreateQuiz(reqData)
        return res.json({ error: quiz.error, message: quiz.mess, data: quiz.data })
    } catch (error) {
        return res.json({ error: 1, message: 'Lỗi server.', data: '' })
    }
}

const UpdateQuiz = async (req, res) => {
    try {
        let reqData = {
            id: req.body.id,
            name: req.body.name,
            time: req.body.time,
            numOfCorrect: req.body.numOfCorrect,
            categoryId: req.body.categoryId
        }

        if (!reqData.id) {
            return res.json({ error: 1, message: 'Không tìm thấy bài thi.', data: '' })
        }

        if (!reqData.name || !reqData.categoryId || !reqData.time || !reqData.numOfCorrect) {
            return res.json({ error: 1, message: 'Vui lòng nhập đầy đủ thông tin.', data: '' })
        }

        let quiz = await quizService.handleUpdateQuiz(reqData)
        return res.json({ error: quiz.error, message: quiz.mess, data: quiz.data })
    } catch (error) {
        return res.json({ error: 1, message: 'Lỗi server.', data: '' })
    }
}

const DeleteQuiz = async (req, res) => {
    try {
        let reqData = {
            id: req.body.id,
        }

        if (!reqData.id) {
            return res.json({ error: 1, message: 'Không tìm thấy bài thi.', data: '' })
        }

        let quiz = await quizService.handleDeleteQuiz(reqData)
        return res.json({ error: quiz.error, message: quiz.mess, data: quiz.data })
    } catch (error) {
        return res.json({ error: 1, message: 'Lỗi server.', data: '' })
    }
}

const GetAllQuiz = async (req, res) => {
    try {
        let condition = req.body.condition;

        let quiz = await quizService.handleGetAllQuiz(condition);
        res.status(quiz.status).json({ message: quiz.message, data: quiz.data });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Lỗi server.', data: null });
    }
};

const GetAllQuizPagination = async (req, res) => {
    try {
        let reqData = {
            page: +req.query.page,
            limit: +req.query.limit
        }
        let conditon = req.body.condition
        let quiz = await quizService.handleGetAllQuizPagination(reqData, conditon)
        return res.json({ error: quiz.error, message: quiz.mess, data: quiz.data, offset: quiz.offset, totalPage: quiz.totalPage })
    } catch (error) {
        return res.json({ error: 1, message: 'Lỗi server.', data: '' })
    }
}

const GetQuizAdmin = async (req, res) => {
    try {
        let quiz = await quizService.handleGetQuizAdmin(req.body.id)
        return res.json({ error: quiz.error, message: quiz.mess, data: quiz.data })
    } catch (error) {
        return res.json({ error: 1, message: 'Lỗi server.', data: '' })
    }
}

const GetQuestionAnswerAdmin = async (req, res) => {
    try {
        let reqData = {
            id: req.body.id,
            page: +req.query.page,
            limit: +req.query.limit,
        }
        let condition = req.body.condition

        if (!reqData.id) {
            return res.json({ error: 1, message: 'Không tìm thấy bài thi.', data: '' })
        }

        let question = await quizService.handleGetQuestionAnswerAdmin(reqData, condition)
        return res.json({ error: question.error, message: question.mess, data: question.data, offset: question.offset, totalPage: question.totalPage })
    } catch (error) {
        return res.json({ error: 1, message: 'Lỗi server.', data: '' })
    }

}

const GetQuizQuestionAnswer = async (req, res) => {
    try {
        let reqData = {
            id: req.body.id,
        };

        if (!reqData.id) {
            return res.status(400).json({ status: 400, message: 'Không tìm thấy bài thi.', data: null });
        }

        let quiz = await quizService.handleGetQuizQuestionAnswer(reqData);
        res.status(quiz.status).json({ message: quiz.message, data: quiz.data });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Lỗi server.', data: null });
    }
};

module.exports = {
    CreateQuiz, UpdateQuiz, DeleteQuiz, GetAllQuiz,
    GetQuizAdmin, GetQuizQuestionAnswer, GetQuestionAnswerAdmin, GetAllQuizPagination
}