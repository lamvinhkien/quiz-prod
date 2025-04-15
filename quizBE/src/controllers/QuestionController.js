const questionService = require('../services/QuestionService.js');

const DeleteQuestion = async (req, res) => {
    try {
        let reqData = {
            id: req.body.id,
        }

        if (!reqData.id) {
            return res.json({ error: 1, message: 'Không tìm thấy câu hỏi.', data: '' })
        }

        let question = await questionService.handleDeleteQuestion(reqData)
        return res.json({ error: question.error, message: question.mess, data: question.data })
    } catch (error) {
        return res.json({ error: 1, message: 'Lỗi server.', data: '' })
    }

}

const CreateQuestionAndAnswer = async (req, res) => {
    try {
        let list = JSON.parse(req.body.listAnswer)
        let data = []
        let img = req.file ? req.file.filename : ''
        Object.entries(list).map(([key, value]) => {
            data.push({
                description: value.description,
                correctAnswer: value.correctAnswer,
            })
        })

        let reqData = {
            name: req.body.name,
            image: img,
            failedPoint: req.body.failedPoint,
            quizId: req.body.quizId,
            listAnswer: data
        }

        if (!reqData.quizId) {
            return res.json({ error: 1, message: 'Không tìm thấy bài thi.', data: '' })
        }

        if (!reqData.name || !reqData.listAnswer || !reqData.failedPoint) {
            return res.json({ error: 1, message: 'Vui lòng nhập đầy đủ thông tin.', data: '' })
        }

        let question = await questionService.handleCreateQuestionAndAnswer(reqData)
        return res.json({ error: question.error, message: question.mess, data: question.data })
    } catch (error) {
        return res.json({ error: 1, message: 'Lỗi server.', data: '' })
    }

}

const UpdateQuestionAndAnswer = async (req, res) => {
    try {
        let img = req.file ? req.file.filename : ''
        let list = JSON.parse(req.body.listAnswer)
        let data = []

        Object.entries(list).map(([key, value]) => {
            data.push({
                description: value.description,
                correctAnswer: value.correctAnswer
            })
        })

        let reqData = {
            id: req.body.id,
            name: req.body.name,
            image: img,
            failedPoint: req.body.failedPoint,
            quizId: req.body.quizId,
            listAnswer: data,
            imgDelete: req.body.imgDelete
        }
        if (!reqData.id) {
            return res.json({ error: 1, message: 'Không tìm thấy câu hỏi.', data: '' })
        }

        if (!reqData.quizId) {
            return res.json({ error: 1, message: 'Không tìm thấy bài thi.', data: '' })
        }

        if (!reqData.name || !reqData.listAnswer || !reqData.failedPoint) {
            return res.json({ error: 1, message: 'Vui lòng nhập đầy đủ thông tin.', data: '' })
        }

        let question = await questionService.handleUpdateQuestionAndAnswer(reqData)
        return res.json({ error: question.error, message: question.mess, data: question.data })
    } catch (error) {
        return res.json({ error: 1, message: 'Lỗi server.', data: '' })
    }

}

module.exports = {
    DeleteQuestion, CreateQuestionAndAnswer, UpdateQuestionAndAnswer,
}