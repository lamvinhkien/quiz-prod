import './Header.scss'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from '../Auth/Context';
import { logoutUser } from '../../Services/AdminAPI';
import { toast } from 'react-toastify';

const Header = () => {
    const location = useLocation()
    const { user, logoutContext } = useContext(UserContext)
    const navigate = useNavigate()

    const handleLogout = async () => {
        let res = await logoutUser()
        if (res) {
            if (res.error === 0) {
                logoutContext()
                toast.success(res.message)
                navigate('/admin')
                return
            }
            toast.error(res.message)
            return
        }
    }

    return (
        <>
            <div className='d-none d-lg-block container'>
                <div className="topnav d-flex justify-content-between align-items-center">
                    <div>
                        {
                            user && user.auth === true &&
                            <>
                                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Trang chủ</Link>
                            </>
                        }
                    </div>
                    <div>
                        <span className='title-header py-2' style={{ float: 'left' }}>ôn thi lý thuyết bằng lái xe</span>
                    </div>
                    <div>
                        {
                            user && user.auth === true &&
                            <>
                                <Link to="/admin" className={location.pathname.includes('/admin') ? 'active' : ''}>Admin</Link>
                                <a id='remain' onClick={handleLogout}>Đăng xuất</a>
                            </>
                        }
                    </div>
                </div>
            </div>
            <div className='d-lg-none d-block'>
                <div className="topnav text-center py-2 px-2">
                    <span className='title-header-mobile'>ôn thi lý thuyết bằng lái xe</span>
                </div>
            </div>
        </>
    )
}

export default Header;