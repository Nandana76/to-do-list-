// server.js
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data
let todos = [
  { id: 1, task: 'Learn React', completed: false },
  { id: 2, task: 'Build a To-Do API', completed: true }
];
let nextId = 3;

// GET /todos
app.get('/todos', (_req, res) => {
  res.json(todos);
});

// POST /todos
app.post('/todos', (req, res) => {
  const { task } = req.body;
  if (!task || !task.trim()) {
    return res.status(400).json({ error: 'Task is required' });
  }
  const newTodo = { id: nextId++, task: task.trim(), completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /todos/:id
app.put('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const { task, completed } = req.body;
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Todo not found' });
  if (typeof task === 'string') todos[idx].task = task.trim();
  if (typeof completed === 'boolean') todos[idx].completed = completed;
  res.json(todos[idx]);
});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = todos.length;
  todos = todos.filter(t => t.id !== id);
  if (todos.length === before) return res.status(404).json({ error: 'Todo not found' });
  res.status(204).send();
});

// health
app.get('/health', (_req, res) => res.send('OK'));

// start server
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
