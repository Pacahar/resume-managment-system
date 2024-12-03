const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'pacahar';

//Проверка
router.get('/', authMiddleware, (req, res) => {
    res.send('Auth page is working');
});

// Регистрация
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Все поля обязательны!' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует!' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, passwordHash, role });
        await newUser.save();

        res.status(201).json({ message: 'Пользователь успешно зарегистрирован!' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
});

// Вход
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Все поля обязательны!' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Неверный email или пароль!' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неверный email или пароль!' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
});

// Проверка текущего пользователя
router.get('/me', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Токен отсутствует!' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден!' });
        }

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: 'Неверный или истекший токен!' });
    }
});

module.exports = router;
