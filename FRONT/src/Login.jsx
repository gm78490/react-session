import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";

const Login = () => {
    const { login } = useContext(UserContext);
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(name, mail);
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
