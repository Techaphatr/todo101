const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { text } = require('body-parser');

const app = express();
const PORT = 15000;

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/todos';

app.use(cors());
app.use(express.json());

// Schema
const Task = mongoose.model('Task', new mongoose.Schema({
    text: String,
    completed: Boolean
}));

// Route
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
})

app.post('/tasks', async (req, res) => {
    const tasks = await Task.create(req.body);
    res.json(tasks);
})

app.put('/tasks/:id', async (req, res) => {
    const tasks = await Task.findByIdAndUpdate(req.params.id, req.body);
    res.json(tasks);
})

app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
})

const connectWithRetry = () => {
    console.log('Trying to connect to MongoDB..');
    mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

        .then(() => {
            console.log('MongoDB connected');
            app.listen(PORT, () => {
                console.log(`Backend running on port ${PORT}`);
            });
        })
        .catch(error => {
            console.error('MongoDB connection error. Retrying in 5s...', error.message);
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();