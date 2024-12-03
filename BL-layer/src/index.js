require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require('./routes/auth')
const resumeRoutes = require('./routes/resumes')
const jobRoutes = require('./routes/jobs')

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`API is running on port ${PORT}`);
});

app.use('/api/auth', authRoutes)

app.use('/api/resumes', resumeRoutes)

app.use('/api/jobs', jobRoutes)

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
