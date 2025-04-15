const jwt = require('jsonwebtoken')
require('dotenv').config()

const createToken = (payload) => {
    try {
        let token = jwt.sign(payload, process.env.PRIVATE_KEY_TOKEN, { expiresIn: process.env.EXPIRES_IN_TOKEN });
        return token;
    } catch (error) {
        return {
            error: 1,
            message: "Vui lòng đăng nhập.",
            data: ""
        }
    }
}

const verifyToken = (token) => {
    try {
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY_TOKEN);

        return {
            status: 200,
            data: decoded,
        };
    } catch (error) {
        return {
            status: 401,
            error: 1,
            message: 'Vui lòng đăng nhập.',
            data: null,
        };
    }
};

const checkUserLogin = (req, res, next) => {
    try {
        let token_cookiesJWT = req.cookies.token_user;

        if (token_cookiesJWT) {
            let token = verifyToken(token_cookiesJWT);

            if (token && token.data) {
                req.dataToken = token.data;
                return next();
            }

            return res.status(401).json({
                status: 401,
                error: 1,
                message: 'Vui lòng đăng nhập.',
                data: null,
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
            error: 1,
            message: 'Lỗi server.',
            data: null,
        });
    }
};

module.exports = { createToken, verifyToken, checkUserLogin }