const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    skills: { type: [String], default: [] },
    email: { type: String, required: true },
    phone: { type: String },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job'},
    status: { type: String, enum: ['Новое', 'Рассмотрено', 'Одобрено', 'Отклонено'], default: 'Новое' }
});

module.exports = mongoose.model('Resume', resumeSchema);
