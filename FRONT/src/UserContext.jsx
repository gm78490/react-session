import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get("http://localhost:9000/check-session", { withCredentials: true });
                setUser(response.data.user);
            } catch {
                setUser(null);
            }
        };

        checkSession();
    }, []);

    const login = async (name, mail) => {
        const response = await axios.post("http://localhost:9000/login", { name, mail }, { withCredentials: true });
        setUser(response.data.user);
    };

    const logout = async () => {
        await axios.post("http://localhost:9000/logout", {}, { withCredentials: true });
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
