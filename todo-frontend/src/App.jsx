import { useEffect, useState } from "react";
import axios from "axios";

// Try proxy first ("/api"), fallback to localhost:5000
const API_BASE =
  import.meta.env.VITE_API_BASE || // you can set VITE_API_BASE in .env
  (window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "/api");

export default function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load todos on start
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/todos`);
        setTodos(res.data);
      } catch (err) {
        setError("❌ Failed to load todos – check if backend is running!");
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Add new todo
  async function addTodo() {
    if (!task.trim()) return;
    try {
      const res = await axios.post(`${API_BASE}/todos`, { task });
      setTodos((prev) => [...prev, res.data]);
      setTask("");
      setError("");
    } catch (err) {
      setError("❌ Could not add todo");
      console.error("Add error:", err);
    }
  }

  // Toggle todo
  async function toggleTodo(id, current) {
    try {
      const res = await axios.put(`${API_BASE}/todos/${id}`, {
        completed: !current,
      });
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? res.data : t))
      );
      setError("");
    } catch (err) {
      setError("❌ Could not update todo");
      console.error("Update error:", err);
    }
  }

  // Delete todo
  async function deleteTodo(id) {
    try {
      await axios.delete(`${API_BASE}/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setError("");
    } catch (err) {
      setError("❌ Could not delete todo");
      console.error("Delete error:", err);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "2rem auto", padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>To-Do List</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="What needs to be done?"
          style={{
            flex: 1,
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button onClick={addTodo} style={{ padding: "8px 14px" }}>
          Add
        </button>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <span
              onClick={() => toggleTodo(todo.id, todo.completed)}
              title="Click to toggle"
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {todo.task}
            </span>
            <button onClick={() => deleteTodo(todo.id)} title="Delete">
              ❌
            </button>
          </li>
        ))}
      </ul>

      {!loading && todos.length === 0 && (
        <p>No todos yet. Add one above!</p>
      )}
    </div>
  );
}
