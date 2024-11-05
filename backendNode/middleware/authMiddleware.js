const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' });

    jwt.verify(token, 'secretKey', (err, user) => {
        if (err) return res.status(403).json({ mensaje: 'Token inválido o expirado' });
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
