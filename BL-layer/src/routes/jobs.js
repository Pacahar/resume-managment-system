const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authMiddleware = require('../middleware/authMiddleware');

// Создание вакансии
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, requirements, salary, company } = req.body;

        const newJob = new Job({
            title,
            description,
            requirements,
            salary,
            company
        });

        await newJob.save();
        res.status(201).json(newJob);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании вакансии', error });
    }
});

// Получение всех вакансий с фильтрацией
router.get('/', async (req, res) => {
    try {
        const { keyword, minSalary, skills } = req.query;

        const filter = {};

        if (keyword) {
            filter.title = { $regex: keyword, $options: 'i' };
        }

        if (minSalary) {
            filter.salary = { $gte: Number(minSalary) };
        }

        if (skills) {
            const skillList = skills.split(',').map(skill => skill.trim());
            filter.requirements = { $all: skillList };
        }

        const jobs = await Job.find(filter);
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении вакансий', error });
    }
});

// Получение списка вакансий (только ID, название и компанию)
router.get('/list', authMiddleware, async (req, res) => {
    try {
        const jobs = await Job.find({}, '_id title company');
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении списка вакансий', error });
    }
});

// Получение конкретной вакансии
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении вакансии', error });
    }
});

// Обновление вакансии
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedJob) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }
        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении вакансии', error });
    }
});

// Удаление вакансии
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        if (!deletedJob) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }
        res.status(200).json({ message: 'Вакансия успешно удалена' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении вакансии', error });
    }
});

module.exports = router;
