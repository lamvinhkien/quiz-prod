const answerService = require('../services/AnswerService.js');

const SubmitAnswer = async (req, res) => {
    try {
        let reqData = req.body.listIdAnswer
        let idQuiz = req.body.id
        let answer = await answerService.handleSubmitAnswer(reqData, idQuiz)
        return res.json({ error: answer.error, message: answer.mess, data: answer.data })
    } catch (error) {
        return res.json({ error: 1, message: 'Lỗi server.', data: '' })
    }
}

module.exports = { SubmitAnswer }