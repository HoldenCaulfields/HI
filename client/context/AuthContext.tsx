"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

//difine the user type:
interface User {
    id: string;
    username: string;
    email: string;
}

//difine auth context structure:
interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email:string, password: string) => Promise<void>;
    logout: () => void;
}

//create context with default empty values
const AuthContext = createContext<AuthContextType | null>(null);

//difine props for AuthProvider:
interface AuthProviderProps {
    children: ReactNode;
}

//AuthProvider component:
export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    //check if user is already logged in (Run once when page load)
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);

            axios.get<User>("http://localhost:5000/api/auth/me", {headers: {Authorization: `Bearer ${token}`}})
                .then((response) => setUser(response.data))
                .catch(() => logout());
        }
    },[]);

    //login function:
    const login = async (email: string, password: string) => {
        const response = await axios.post<{token: string, user: User}>(
            "http://localhost:5000/api/auth/login", {email, password}
        );

        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
    };

    //register function:
    const register = async (username: string, email: string, password: string) => {
        await axios.post("http://localhost:5000/api/auth/register", {username, email, password});
    };

    //logout function:
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{user, token, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;