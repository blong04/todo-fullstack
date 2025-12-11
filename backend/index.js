// backend/index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// "Giả vờ" database bằng mảng trong RAM
let tasks = [];
let idCounter = 1;

// GET /api/tasks - Lấy danh sách task
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// POST /api/tasks - Thêm task mới
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: idCounter++,
    title: title.trim(),
    completed: 0,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH /api/tasks/:id - Đổi trạng thái completed
app.patch('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const { completed } = req.body;

  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  task.completed = completed ? 1 : 0;
  res.json(task);
});

// DELETE /api/tasks/:id - Xoá task
app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter((t) => t.id !== id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`✅ Todo Backend listening at http://localhost:${PORT}`);
});
