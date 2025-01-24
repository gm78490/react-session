import express from "express";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = 9000;

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Database connection
const db = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "your_database_name",
});

// Login endpoint
app.post("/login", async (req, res) => {
    const { name, mail } = req.body;

    try {
        const [rows] = await db.query("SELECT * FROM user WHERE name = ? AND mail = ?", [name, mail]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = rows[0];
        const sessionId = `${user.id}-${Date.now()}`;

        // Insert session
        await db.query("INSERT INTO authentication (user_id, session_id) VALUES (?, ?)", [user.id, sessionId]);

        res.cookie("session_id", sessionId, { httpOnly: true });
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// Logout endpoint
app.post("/logout", async (req, res) => {
    const sessionId = req.cookies.session_id;

    try {
        await db.query("DELETE FROM authentication WHERE session_id = ?", [sessionId]);
        res.clearCookie("session_id");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// Check session
app.get("/check-session", async (req, res) => {
    const sessionId = req.cookies.session_id;

    try {
        const [rows] = await db.query(
            "SELECT user.* FROM authentication JOIN user ON authentication.user_id = user.id WHERE session_id = ?",
            [sessionId]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Session invalid" });
        }

        res.status(200).json({ user: rows[0] });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
