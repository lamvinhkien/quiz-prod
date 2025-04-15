import axios from '../Setup/axiosSetup';

const getUser = () => {
    let res = axios.get("/admin/get")
    return res
}

const loginUser = (username, password) => {
    let res = axios.post('/admin/login', { username: username, password: password })
    return res
}

const logoutUser = () => {
    let res = axios.post('/admin/logout')
    return res
}

export {
    getUser, loginUser, logoutUser
}