import db from "../db.js"; // Connexion à la base de données
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Crée un nouvel utilisateur
export const create = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO user (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);
        res.status(201).json({ message: "Utilisateur créé avec succès." });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la création de l'utilisateur." });
    }
};

// Connecte un utilisateur
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query("SELECT * FROM user WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Utilisateur introuvable." });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: "Mot de passe incorrect." });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, "SECRET_KEY", { expiresIn: "1h" });

        res.cookie("authToken", token, { httpOnly: true });
        res.status(200).json({ message: "Connexion réussie.", user });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la connexion." });
    }
};

// Déconnecte un utilisateur
export const logout = (req, res) => {
    res.clearCookie("authToken");
    res.status(200).json({ message: "Déconnexion réussie." });
};

// Vérifie si un utilisateur est connecté
export const check_auth = (req, res) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ error: "Non authentifié." });
    }

    try {
        const decoded = jwt.verify(token, "SECRET_KEY");
        res.status(200).json({ user: decoded });
    } catch (err) {
        res.status(401).json({ error: "Token invalide." });
    }
};
