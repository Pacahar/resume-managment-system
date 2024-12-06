const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const authMiddleware = require('../middleware/authMiddleware');

// Создание резюме с привязкой к вакансии
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, description, email, phone, skills, jobId } = req.body;

        let linkedJob = null;
        if (jobId) {
            linkedJob = await Job.findById(jobId);
            if (!linkedJob) {
                return res.status(404).json({ message: 'Указанная вакансия не найдена' });
            }
        }

        const newResume = new Resume({
            name,
            description,
            email,
            phone,
            skills,
            job: jobId || null
        });
        await newResume.save();

        res.status(201).json({ message: 'Резюме успешно создано', resume: newResume });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании резюме', error });
    }
});

// Получение всех резюме
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { jobId } = req.query; // Получение jobId из параметров запроса

        const filter = jobId ? { job: jobId } : {}; // Условие фильтрации

        const resumes = await Resume.find(filter).populate('job', 'title company');
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении резюме', error });
    }
});


// Получение конкретного резюме
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id).populate('job', 'title company');
        if (!resume) {
            return res.status(404).json({ message: 'Резюме не найдено' });
        }
        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении резюме', error });
    }
});

// Обновление резюме
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { jobId, ...updateData } = req.body;

        if (jobId) {
            const job = await Job.findById(jobId);
            if (!job) {
                return res.status(404).json({ message: 'Указанная вакансия не найдена' });
            }
            updateData.job = jobId;
        }

        const updatedResume = await Resume.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });
        if (!updatedResume) {
            return res.status(404).json({ message: 'Резюме не найдено' });
        }
        res.status(200).json(updatedResume);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении резюме', error });
    }
});

// Удаление резюме
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deletedResume = await Resume.findByIdAndDelete(req.params.id);
        if (!deletedResume) {
            return res.status(404).json({ message: 'Резюме не найдено' });
        }
        res.status(200).json({ message: 'Резюме успешно удалено' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении резюме', error });
    }
});

// Обновление статуса резюме
router.patch('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !['Новое', 'Рассмотрено', 'Одобрено', 'Отклонено'].includes(status)) {
            return res.status(400).json({ message: 'Некорректный статус' });
        }

        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ message: 'Резюме не найдено' });
        }

        resume.status = status;
        await resume.save();

        res.status(200).json({ message: 'Статус успешно обновлен', resume });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении статуса', error });
    }
});


module.exports = router;
