const jwt = require("jsonwebtoken");

const JWTVerifier = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.sendStatus(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (err) return res.sendStatus(403).json({ message: "Forbidden" });
        req.user = decoded.infoUser.username;
        req.roles = decoded.infoUser.roles;
        next();
    });
}

module.exports = JWTVerifier;
    