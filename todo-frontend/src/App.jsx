import { useEffect, useState } from "react";
import axios from "axios";

import Header from "./components/Header";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import ErrorMessage from "./components/ErrorMessage";

// Try proxy first ("/api"), fallback to localhost:5000
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (window.location.hostname === "localhost" ? "http://localhost:5000" : "/api");

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("all"); // all | completed | pending
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  async function loadTodos() {
    try {
      setLoading(true);
      const params = {};
      if (status !== "all") params.status = status;
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      const res = await axios.get(`${API_BASE}/todos`, { params });
      setTodos(res.data);
      setError("");
    } catch (err) {
      setError("❌ Failed to load todos – check if backend is running!");
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []); // initial load

  // re-query when filters change (debounce search in real apps)
  useEffect(() => {
    loadTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, category]);

  async function addTodo(payload) {
    try {
      const res = await axios.post(`${API_BASE}/todos`, payload);
      setTodos((prev) => [res.data, ...prev]);
      setError("");
    } catch (err) {
      setError("❌ Could not add todo");
      console.error("Add error:", err);
    }
  }

  async function toggleTodo(id, current) {
    try {
      const res = await axios.put(`${API_BASE}/todos/${id}`, {
        completed: !current
      });
      setTodos((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      setError("");
    } catch (err) {
      setError("❌ Could not update todo");
      console.error("Update error:", err);
    }
  }

  async function deleteTodo(id) {
    try {
      await axios.delete(`${API_BASE}/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t._id !== id));
      setError("");
    } catch (err) {
      setError("❌ Could not delete todo");
      console.error("Delete error:", err);
    }
  }

  async function clearCompleted() {
    try {
      await axios.delete(`${API_BASE}/todos`);
      loadTodos();
    } catch (err) {
      setError("❌ Could not clear completed");
      console.error("Clear error:", err);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", padding: 16 }}>
      <Header />
      <TodoForm onAdd={addTodo} />

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search… (press Enter)"
          onKeyDown={(e) => e.key === "Enter" && loadTodos()}
          style={{ flex: 1, padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
        >
          <option value="">All categories</option>
          <option>General</option>
          <option>Work</option>
          <option>Personal</option>
          <option>Shopping</option>
        </select>
        <button onClick={clearCompleted}>Clear Completed</button>
      </div>

      {loading && <p>Loading…</p>}
      <ErrorMessage error={error} />

      {!loading && (
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      )}
    </div>
  );
}
