const db = require('../models/index.js');

const handleSubmitAnswer = async (reqData, idQuiz) => {
    try {
        let score = 0;
        let check = false;

        // Lấy toàn bộ dữ liệu của bài thi cùng câu hỏi và đáp án
        let quiz = await db.Quiz.findOne({
            where: { id: idQuiz },
            attributes: ['id', 'name'],
            include: {
                model: db.Question,
                attributes: ['id', 'name', 'failedPoint', 'quizId'],
                include: {
                    model: db.Answer,
                    attributes: ['id', 'description', 'questionId', 'correctAnswer']
                }
            }
        });

        if (!reqData || reqData.length === 0) {
            return {
                error: 0,
                mess: 'Nộp bài thi thành công.',
                data: { score, check, result: quiz }
            };
        }

        // Lấy danh sách ID câu trả lời từ reqData
        let answerIds = reqData.map(item => item.id);

        // Truy vấn lấy toàn bộ danh sách câu trả lời theo answerIds
        let answers = await db.Answer.findAll({
            where: { id: [...answerIds], correctAnswer: true },
            raw: true
        });

        // Tạo Set để kiểm tra nhanh các câu hỏi đã được trả lời
        let answeredQuestionIds = new Set(answers.map(ans => ans.questionId));

        // Lọc ra các câu hỏi điểm liệt
        let failedQuestions = quiz.Questions.filter(q => q.failedPoint === true);

        // Duyệt từng câu hỏi điểm liệt để kiểm tra
        for (let failedQ of failedQuestions) {
            if (!answeredQuestionIds.has(failedQ.id)) {
                check = true; // Không trả lời câu điểm liệt
                break;
            }
        }

        // Tính điểm chỉ dựa trên câu trả lời đúng
        score = answers.length;

        return {
            error: 0,
            mess: 'Nộp bài thi thành công.',
            data: { score, check, result: quiz }
        };
    } catch (error) {
        return {
            error: 1,
            mess: 'Lỗi server.',
            data: ''
        };
    }
};

module.exports = { handleSubmitAnswer }