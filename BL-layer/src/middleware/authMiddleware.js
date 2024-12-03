const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'pacahar'

// Проверка токена
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Токен отсутствует!' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Неверный или истекший токен!' });
    }
}

module.exports = authMiddleware;