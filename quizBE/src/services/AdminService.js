const bcrypt = require('bcrypt');
const db = require('../models/index.js');
const { createToken } = require('../middleware/jwtAction.js');

const checkPassword = async (inputPassword, hashPassword) => {
    let res = await bcrypt.compare(inputPassword, hashPassword);
    return res;
}

const handleLogin = async (reqData) => {
    try {
        let user = await db.Admin.findOne({ where: { username: reqData.username } })

        if (!user) {
            return {
                error: 1,
                mess: 'Không tìm thấy người dùng.',
                data: ''
            }
        }

        let maxWrongPw = 4
        let wrongLogin = +user.wrongLogin
        let expiresLock = +user.expiresLock
        let now = Date.now()
        let isCorrectPassword = await checkPassword(reqData.password, user.password)

        if (expiresLock > now) {
            return {
                error: 1,
                mess: 'Người dùng đã bị khoá ít phút, vui lòng thử lại sau.',
                data: ''
            }
        }

        if (!isCorrectPassword) {
            if (wrongLogin === maxWrongPw) {
                await user.update({ wrongLogin: 0, expiresLock: now + 60000 })
                return {
                    error: 1,
                    mess: 'Người dùng đã bị khoá ít phút, vui lòng thử lại sau.',
                    data: ''
                }
            }

            await user.update({ wrongLogin: wrongLogin + 1 })
            return {
                error: 1,
                mess: 'Sai mật khẩu.',
                data: ''
            }
        }

        await user.update({ wrongLogin: 0, expiresLock: 0 })

        let payload = {
            id: user.id,
            username: user.username,
        }

        let token = createToken(payload)

        return {
            error: 0,
            mess: 'Đăng nhập thành công.',
            data: {
                id: user.id,
                username: user.username,
                token: token
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

module.exports = { handleLogin }