import { useState, useContext } from 'react';
import { loginUser } from '../../Services/AdminAPI';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from './Context';

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { loginContext } = useContext(UserContext)
    const navigate = useNavigate()

    const handleChangeUsername = (event) => {
        setUsername(event)
    }

    const handleChangePassword = (event) => {
        setPassword(event)
    }

    const handlePressEnter = (event) => {
        if (event.key === "Enter" && event.keyCode === 13) {
            handleLogin()
        }
    }

    const handleLogin = async () => {
        if (username === '' || password === '') {
            toast.error('Vui lòng nhập tên người dùng và mật khẩu.')
            return
        }

        let res = await loginUser(username, password)
        if (res) {
            if (res.error === 0) {
                loginContext(res.data)
                navigate('/admin')
                return
            }
            toast.error(res.message)
            return
        }

    }

    return (
        <div className="container px-4">
            <div className='row justify-content-center align-items-center' style={{ height: '570px' }}>
                <div style={{ width: '400px' }} className='p-3 bg-primary-subtle rounded-3'>
                    <div className='col-12 mb-3'>
                        <label className='mb-1'><i className="fa fa-user"></i> Tên người dùng</label>
                        <input type='text' className='form-control' placeholder='Nhập tên người dùng.....'
                            value={username} onChange={(event) => { handleChangeUsername(event.target.value) }}
                            onKeyDown={(event) => handlePressEnter(event)} />
                    </div>
                    <div className='col-12 mb-3'>
                        <label className='mb-1'><i className="fa fa-lock"></i> Mật khẩu</label>
                        <input type='password' className='form-control' placeholder='Nhập mật khẩu.....'
                            value={password} onChange={(event) => { handleChangePassword(event.target.value) }}
                            onKeyDown={(event) => handlePressEnter(event)} />
                    </div>
                    <div className='col-12 mb-3'>
                        <button className='btn btn-success w-100' onClick={handleLogin}>Đăng nhập</button>
                    </div>
                    <div className='text-end'>
                        <Link to="/" className="text-decoration-none fw-medium">Quay về trang chủ <i className="fa fa-undo"></i></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;