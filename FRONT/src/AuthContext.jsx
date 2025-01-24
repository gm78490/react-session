import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        const response = await fetch("http://localhost:9000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data.user);
        } else {
            const error = await response.json();
            throw new Error(error.error);
        }
    };

    const logout = async () => {
        await fetch("http://localhost:9000/auth/logout", { credentials: "include" });
        setUser(null);
    };

    const checkAuth = async () => {
        const response = await fetch("http://localhost:9000/auth/check-auth", { credentials: "include" });

        if (response.ok) {
            const data = await response.json();
            setUser(data.user);
        } else {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
