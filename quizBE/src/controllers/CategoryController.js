const categoryService = require('../services/CategoryService.js');

const CreateCategory = async (req, res) => {
    try {
        let reqData = {
            name: req.body.name,
        }

        if (!reqData.name) {
            return res.json({ error: 1, message: 'Vui lòng nhập tên danh mục.', data: '' })
        }

        let category = await categoryService.handleCreateCategory(reqData)
        return res.json({ error: category.error, message: category.mess, data: category.data })
    } catch (error) {
        return res.json({ error: 1, message: 'Lỗi server.', data: '' })
    }
}

const UpdateCategory = async (req, res) => {
    try {
        let reqData = {
            id: req.body.id,
            name: req.body.name
        }

        if (!reqData.id) {
            return res.json({ error: 1, message: 'Không tìm thấy danh mục bài thi.', data: '' })
        }

        if (!reqData.name) {
            return res.json({ error: 1, message: 'Vui lòng nhập đầy đủ thông tin.', data: '' })
        }

        let category = await categoryService.handleUpdateCategory(reqData)
        return res.json({ error: category.error, message: category.mess, data: category.data })
    } catch (error) {
        return res.json({ error: 1, message: 'Lỗi server.', data: '' })
    }
}

const DeleteCategory = async (req, res) => {
    try {
        let reqData = {
            id: req.body.id,
        }

        if (!reqData.id) {
            return res.json({ error: 1, message: 'Không tìm thấy danh mục bài thi.', data: '' })
        }

        let category = await categoryService.handleDeleteCategory(reqData)
        return res.json({ error: category.error, message: category.mess, data: category.data })
    } catch (error) {
        return res.json({ error: 1, message: 'Lỗi server.', data: '' })
    }
}

const GetAllCategory = async (req, res) => {
    const result = await categoryService.handleGetAllCategory();

    res.status(result.status).json({
        message: result.message,
        data: result.data,
    });
}

const GetCategoryPagination = async (req, res) => {
    try {
        let reqData = {
            page: +req.query.page,
            limit: +req.query.limit
        }

        let category = await categoryService.handleGetCategoryPagination(reqData)
        return res.json({ error: category.error, message: category.mess, data: category.data })
    } catch (error) {
        return res.json({ error: 1, message: 'Lỗi server.', data: '' })
    }
}

module.exports = { CreateCategory, UpdateCategory, DeleteCategory, GetAllCategory, GetCategoryPagination }