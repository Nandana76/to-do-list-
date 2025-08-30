import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Todo from "./models/Todo.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- DB connect ---
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MONGODB_URI missing in .env");
  process.exit(1);
}
mongoose
  .connect(uri, { dbName: mongoose.connection?.db?.databaseName || undefined })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((e) => {
    console.error("❌ MongoDB connection error:", e.message);
    process.exit(1);
  });

// --- Health check ---
app.get("/", (_req, res) => res.json({ ok: true }));

// --- CRUD: /todos ---

// GET /todos?status=all|completed|pending&search=...&category=...
app.get("/todos", async (req, res) => {
  try {
    const { status = "all", search = "", category } = req.query;

    const query = {};
    if (status === "completed") query.completed = true;
    if (status === "pending") query.completed = false;
    if (category) query.category = category;
    if (search) query.task = { $regex: search, $options: "i" };

    const todos = await Todo.find(query).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error("GET /todos error:", err);
    res.status(500).json({ message: "Failed to fetch todos" });
  }
});

// POST /todos  { task, category?, dueDate? }
app.post("/todos", async (req, res) => {
  try {
    const { task, category, dueDate } = req.body;
    if (!task || !task.trim()) {
      return res.status(400).json({ message: "Task is required" });
    }
    const todo = await Todo.create({
      task: task.trim(),
      category: category || "General",
      dueDate: dueDate ? new Date(dueDate) : undefined
    });
    res.status(201).json(todo);
  } catch (err) {
    console.error("POST /todos error:", err);
    res.status(500).json({ message: "Failed to create todo" });
  }
});

// PUT /todos/:id  { task?, completed?, category?, dueDate? }
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payload = {};
    ["task", "completed", "category", "dueDate"].forEach((k) => {
      if (req.body[k] !== undefined) payload[k] = req.body[k];
    });
    if (payload.task) payload.task = payload.task.trim();
    if (payload.dueDate) payload.dueDate = new Date(payload.dueDate);

    const updated = await Todo.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: "Todo not found" });
    res.json(updated);
  } catch (err) {
    console.error("PUT /todos/:id error:", err);
    res.status(500).json({ message: "Failed to update todo" });
  }
});

// DELETE /todos/:id
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Todo.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Todo not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /todos/:id error:", err);
    res.status(500).json({ message: "Failed to delete todo" });
  }
});

// Optional: clear completed
app.delete("/todos", async (req, res) => {
  try {
    const result = await Todo.deleteMany({ completed: true });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    console.error("DELETE /todos error:", err);
    res.status(500).json({ message: "Failed to clear completed" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 API running on http://localhost:${port}`));
