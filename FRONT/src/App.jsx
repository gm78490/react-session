import React, { useContext, useEffect } from "react";
import { AuthProvider, AuthContext } from "./AuthContext";
import LoginForm from "./LoginForm";

const HomePage = () => {
    const { user, logout, checkAuth } = useContext(AuthContext);

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <div>
            {user ? (
                <>
                    <h1>Bienvenue, {user.name}</h1>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <LoginForm />
            )}
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <HomePage />
        </AuthProvider>
    );
};

export default App;

