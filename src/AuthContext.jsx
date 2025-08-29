import { jwtDecode } from "jwt-decode";
import { Children, createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [username, setUsername] = useState(localStorage.getItem('username'));

    const navigate = useNavigate();

    useEffect(() => {
        if(token){
            try {
                const {exp} = jwtDecode(token);
                if(Date.now() >= exp * 1000){
                    logout();
                } 
            } catch (error) {
                console.error("Token expired or Jwt decode failed", error);
                logout();
            }
        }
    }, [token]);

    const onLogin = (newToken, newUsername) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('username', newUsername);
        setToken(newToken);
        setUsername(newUsername);
        navigate('/homepage');
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken(null);
        setUsername(null);
        navigate('/login');
    }

    return (
        <AuthContext.Provider value={{onLogin, logout, username, token}}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () =>  useContext(AuthContext);