const db = require('../models/index.js');
const fs = require('fs').promises;
const path = require('path');

const handleDeleteQuestion = async (reqData) => {
    try {
        const question = await db.Question.findOne({
            where: { id: reqData.id }
        });

        if (!question) {
            return {
                error: 1,
                mess: 'Không tìm thấy câu hỏi.',
                data: ''
            };
        }

        // Nếu có ảnh thì xoá ảnh trước
        if (question.image) {
            const imagePath = path.join(__dirname, '../public/uploads', question.image);
            try {
                await fs.unlink(imagePath);
            } catch (err) {
                console.warn('Không thể xoá ảnh:', err.message);
            }
        }

        await question.destroy();

        return {
            error: 0,
            mess: 'Xoá câu hỏi thành công.',
            data: ''
        };

    } catch (error) {
        console.error('Lỗi xoá câu hỏi:', error);
        return {
            error: 1,
            mess: 'Lỗi server.',
            data: ''
        };
    }
};

const handleCreateQuestionAndAnswer = async (reqData) => {
    try {
        let question = await db.Question.create(
            {
                name: reqData.name,
                image: reqData.image,
                failedPoint: reqData.failedPoint,
                quizId: reqData.quizId,
            },
        )

        let buildAnswer = reqData.listAnswer.map(item => ({ ...item, questionId: question.id }))

        await db.Answer.bulkCreate(buildAnswer)

        return {
            error: 0,
            mess: 'Thêm câu hỏi và các câu trả lời thành công.',
            data: ''
        }
    } catch (error) {
        return {
            error: 1,
            mess: 'Lỗi server.',
            data: ''
        }
    }
}

const handleUpdateQuestionAndAnswer = async (reqData) => {
    try {
        const question = await db.Question.findOne({ where: { id: reqData.id } });

        if (!question) {
            return {
                error: 1,
                mess: 'Không tìm thấy câu hỏi.',
                data: ''
            };
        }

        await db.Answer.destroy({ where: { questionId: question.id } });
        const newAnswers = reqData.listAnswer.map(item => ({ ...item, questionId: question.id }));
        await db.Answer.bulkCreate(newAnswers);

        if (reqData.imgDelete === 'yes' && question.image) {
            const oldImagePath = path.join(__dirname, '../public/uploads', question.image);
            try {
                await fs.unlink(oldImagePath);
            } catch (err) {
                console.warn('Không thể xoá ảnh cũ:', err.message);
            }
        }

        const updatedData = {
            name: reqData.name,
            quizId: reqData.quizId,
            failedPoint: reqData.failedPoint
        };

        if (reqData.image !== '') {
            updatedData.image = reqData.image;
        } else if (reqData.imgDelete === 'yes') {
            updatedData.image = '';
        }

        await question.update(updatedData);

        return {
            error: 0,
            mess: 'Cập nhật câu hỏi và các câu trả lời thành công.',
            data: ''
        };

    } catch (error) {
        console.error('Lỗi update câu hỏi:', error);
        return {
            error: 1,
            mess: 'Lỗi server.',
            data: ''
        };
    }
};

module.exports = {
    handleDeleteQuestion, handleCreateQuestionAndAnswer, handleUpdateQuestionAndAnswer
}