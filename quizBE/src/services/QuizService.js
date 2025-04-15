const db = require('../models/index.js');
const fs = require('fs').promises;
const { Op } = require('sequelize');
const path = require('path');
require('dotenv').config()

const handleCreateQuiz = async (reqData) => {
    try {
        await db.Quiz.create({
            name: reqData.name,
            time: reqData.time,
            numOfCorrect: reqData.numOfCorrect,
            categoryId: reqData.categoryId
        })

        return {
            error: 0,
            mess: 'Thêm bài thi thành công.',
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

const handleUpdateQuiz = async (reqData) => {
    try {
        let quiz = await db.Quiz.findOne({
            where: {
                id: reqData.id
            }
        })

        if (quiz) {
            await quiz.update({
                name: reqData.name,
                time: reqData.time,
                numOfCorrect: reqData.numOfCorrect,
                categoryId: reqData.categoryId
            })

            return {
                error: 0,
                mess: 'Cập nhật bài thi thành công.',
                data: ''
            }
        } else {
            return {
                error: 1,
                mess: 'Không tìm thấy bài thi.',
                data: ''
            }
        }
    } catch (error) {
        return {
            error: 1,
            mess: 'Lỗi server.',
            data: ''
        }
    }

}

const handleDeleteQuiz = async (reqData) => {
    try {
        const quiz = await db.Quiz.findOne({
            where: { id: reqData.id }
        });

        if (!quiz) {
            return {
                error: 1,
                mess: 'Không tìm thấy bài thi.',
                data: ''
            };
        }

        const questions = await db.Question.findAll({ where: { quizId: quiz.id }, raw: true });

        if (questions && questions.length > 0) {
            for (const question of questions) {
                if (question.image && question.image !== '') {
                    const filePath = path.resolve(__dirname, '../public/uploads', question.image);
                    try {
                        await fs.unlink(filePath);
                    } catch (err) {
                        if (err.code === 'ENOENT') {
                            console.warn('⚠️  File không tồn tại:', filePath);
                        } else {
                            console.error('❌ Lỗi khi xoá file:', err);
                        }
                    }
                }
            }
        }

        await quiz.destroy();

        return {
            error: 0,
            mess: 'Xoá bài thi thành công.',
            data: ''
        };

    } catch (error) {
        console.error('❌ Server error:', error);
        return {
            error: 1,
            mess: 'Lỗi server.',
            data: ''
        };
    }
};

const handleGetAllQuiz = async (condition) => {
    try {
        let whereCondition = {};
        if (condition && condition !== '') {
            whereCondition = { id: condition };
        }

        let quiz = await db.Quiz.findAll({
            attributes: ['id', 'name'],
            include: { model: db.Category, where: whereCondition, attributes: ['id', 'name'] },
            order: [['name', 'ASC']],
            raw: true,
        });

        return {
            status: 200,
            message: 'Get all quiz success.',
            data: quiz,
        };
    } catch (error) {
        return {
            status: 500,
            message: 'Lỗi server.',
            data: null,
        };
    }
};

const handleGetAllQuizPagination = async (reqData, condition) => {
    try {
        let offset = (reqData.page - 1) * reqData.limit
        let whereCondition = {}
        if (condition && condition !== '') {
            whereCondition = { id: condition }
        }

        let quiz = await db.Quiz.findAll({
            attributes: ['id', 'name'],
            include: { model: db.Category, where: whereCondition, attributes: ['id', 'name'] },
            limit: reqData.limit,
            order: [['name', 'ASC']],
            offset: offset
        })
        let countQuiz = await db.Quiz.count({
            include: { model: db.Category, where: whereCondition, attributes: ['id', 'name'] }
        })
        let totalPage = Math.ceil(countQuiz / reqData.limit)

        return {
            error: 0,
            mess: 'Get all quiz success.',
            data: quiz,
            offset: offset,
            totalPage: totalPage
        }
    } catch (error) {
        return {
            error: 1,
            mess: 'Lỗi server.',
            data: ''
        }
    }

}

const handleGetQuizAdmin = async (id) => {
    try {
        let quiz = await db.Quiz.findOne({
            where: { id: id },
            attributes: ['id', 'name', 'time', 'numOfCorrect'],
            include: { model: db.Category, attributes: ['id'] },
            raw: true,
            nest: true
        })

        return {
            error: 0,
            mess: 'Get quiz success.',
            data: quiz
        }
    } catch (error) {
        return {
            error: 1,
            mess: 'Lỗi server.',
            data: ''
        }
    }

}

const handleGetQuestionAnswerAdmin = async (reqData, condition) => {
    try {
        let offset = (reqData.page - 1) * reqData.limit
        let whereCondition = { quizId: reqData.id }

        if (condition) {
            let fieldCondition = ['image', 'failedPoint']
            fieldCondition.forEach((item) => {
                if (condition[item]) {
                    let { operator, value } = condition[item]
                    if (operator === 'ne' || operator === 'eq') {
                        whereCondition[item] = { [Op[operator]]: value }
                    }
                }
            })
        }

        let question = await db.Question.findAll({
            where: whereCondition,
            attributes: ['id', 'name', 'image', 'failedPoint', 'quizId'],
            include: {
                model: db.Answer,
                attributes: ['id', 'description', 'questionId', 'correctAnswer'],
            },
            limit: reqData.limit,
            offset: offset
        })
        let countQuestion = await db.Question.count({ where: whereCondition })
        let totalPage = Math.ceil(countQuestion / reqData.limit)

        question.forEach((item, index) => {
            if (item.image !== '') {
                item.image = `/uploads/${item.image}`;
            }
        })

        return {
            error: 0,
            mess: 'Get quiz, question, answer success.',
            data: question,
            offset: offset,
            totalPage: totalPage
        }
    } catch (error) {
        return {
            error: 1,
            mess: 'Lỗi server.',
            data: ''
        }
    }

}

const handleGetQuizQuestionAnswer = async (reqData) => {
    try {
        let quiz = await db.Quiz.findOne({
            where: { id: reqData.id },
            attributes: ['id', 'name', 'time', 'numOfCorrect'],
            include: {
                model: db.Question,
                attributes: ['id', 'name', 'image', 'failedPoint', 'quizId'],
                include: {
                    model: db.Answer,
                    attributes: ['id', 'description', 'questionId'],
                },
            },
        });

        if (!quiz) {
            return { status: 404, message: 'Không tìm thấy bài thi.', data: null };
        }

        quiz.Questions.forEach((item, index) => {
            if (item.image !== '') {
                item.image = `/uploads/${item.image}`;
            }
        });

        return {
            status: 200,
            message: 'Get quiz, question, answer success.',
            data: quiz,
        };
    } catch (error) {
        return {
            status: 500,
            message: 'Lỗi server.',
            data: null,
        };
    }
};

module.exports = {
    handleCreateQuiz, handleUpdateQuiz, handleDeleteQuiz, handleGetAllQuiz,
    handleGetQuizAdmin, handleGetQuizQuestionAnswer, handleGetQuestionAnswerAdmin, handleGetAllQuizPagination
}