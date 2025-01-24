import jwt from "jsonwebtoken";

const withAuth = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ error: "Non authentifié." });
    }

    try {
        const decoded = jwt.verify(token, "SECRET_KEY");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Token invalide." });
    }
};

export default withAuth;
