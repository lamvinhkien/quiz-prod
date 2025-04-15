const db = require('../models/index.js');
require('dotenv').config()

const handleCreateCategory = async (reqData) => {
    try {
        await db.Category.create({
            name: reqData.name
        })

        return {
            error: 0,
            mess: 'Thêm danh mục bài thi thành công.',
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

const handleUpdateCategory = async (reqData) => {
    try {
        let category = await db.Category.findOne({
            where: {
                id: reqData.id
            }
        })

        if (category) {
            await category.update({
                name: reqData.name
            })

            return {
                error: 0,
                mess: 'Cập nhật danh mục bài thi thành công.',
                data: ''
            }
        } else {
            return {
                error: 1,
                mess: 'Không tìm thấy danh mục bài thi.',
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

const handleDeleteCategory = async (reqData) => {
    try {
        let category = await db.Category.findOne({
            where: {
                id: reqData.id
            }
        })

        if (category) {
            await category.destroy()

            return {
                error: 0,
                mess: 'Xoá danh mục bài thi thành công.',
                data: ''
            }
        } else {
            return {
                error: 1,
                mess: 'Không tìm thấy danh mục bài thi.',
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

const handleGetAllCategory = async () => {
    try {
        let category = await db.Category.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']],
            raw: true,
        });

        return {
            status: 200,
            message: 'Get all category success.',
            data: category,
        };
    } catch (error) {
        console.error('check error: ', error);
        return {
            status: 500,
            message: 'Lỗi server.',
            data: null,
        };
    }
}

const handleGetCategoryPagination = async (reqData) => {
    try {
        let offset = (reqData.page - 1) * reqData.limit
        let { count, rows } = await db.Category.findAndCountAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']],
            limit: reqData.limit,
            offset: offset
        })
        let totalPage = Math.ceil(count / reqData.limit)

        return {
            error: 0,
            mess: 'Get all category success.',
            data: { category: rows, offset: offset, totalPage: totalPage }
        }
    } catch (error) {
        return {
            error: 1,
            mess: 'Lỗi server.',
            data: ''
        }
    }

}


module.exports = {
    handleCreateCategory, handleUpdateCategory, handleDeleteCategory, handleGetAllCategory, handleGetCategoryPagination
}