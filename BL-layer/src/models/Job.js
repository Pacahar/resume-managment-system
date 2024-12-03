const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    requirements: { type: [String], default: [] },
    salary: { type: Number },
    company: { type: String, required: true }
});

module.exports = mongoose.model('Job', jobSchema);
