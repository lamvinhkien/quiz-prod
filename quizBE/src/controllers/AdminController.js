const adminService = require('../services/AdminService')

const loginFunc = async (req, res) => {
    try {
        let reqData = {
            username: req.body.username,
            password: req.body.password
        }

        if (!reqData) {
            return res.json({ error: 1, message: 'Vui lòng nhập username và password.', data: '' })
        }

        let admin = await adminService.handleLogin(reqData)
        if (admin.error === 0) {
            res.cookie("token_user", admin.data.token, { httpOnly: true, maxAge: process.env.EXPIRES_IN_COOKIES })
        }
        return res.json({ error: admin.error, message: admin.mess, data: admin.data })
    } catch (error) {
        return res.json({ error: 1, message: 'Lỗi server.', data: '' })
    }
}

const logoutFunc = async (req, res) => {
    try {
        res.clearCookie("token_user");
        return res.json({
            error: 0,
            message: "Đăng xuất thành công.",
            data: ""
        })
    } catch (error) {
        return res.json({
            error: 1,
            message: "Lỗi server.",
            data: ""
        })
    }
}

const getUserFunc = async (req, res) => {
    try {
        let data = req.dataToken;
        if (data) {
            return res.status(200).json({
                status: 200,
                error: 0,
                message: 'Đăng nhập thành công.',
                data: data,
            });
        }

        return res.status(401).json({
            status: 401,
            error: 1,
            message: 'Vui lòng đăng nhập.',
            data: null,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server.',
            data: null,
        });
    }
};

module.exports = { loginFunc, logoutFunc, getUserFunc }