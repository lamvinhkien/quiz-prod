import { useEffect, useState, createContext } from "react"
import { getUser } from "../../Services/AdminAPI";

const UserContext = createContext({});

const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ auth: false });

    const loginContext = (userData) => {
        setUser({ ...userData, auth: true })
    };

    const logoutContext = () => {
        setUser({ auth: false });
    };

    const fetchUser = async () => {
        let res = await getUser()
        if (res && res.error === 0) {
            setUser({ ...res.data, auth: true })
        } else {
            setUser({})
        }
    }

    useEffect(() => {
        if (window.location.pathname === '/admin') {
            fetchUser()
        }
    }, [])

    return (
        <UserContext.Provider value={{ user: user, loginContext: loginContext, logoutContext: logoutContext, fetchUser: fetchUser }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider }