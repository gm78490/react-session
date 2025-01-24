import React, { useContext } from "react";
import { UserContext } from "./UserContext";

const Logout = () => {
    const { logout } = useContext(UserContext);

    return <button onClick={logout}>Logout</button>;
};

export default Logout;
