import { useState } from "react";

export default function TodoForm({ onAdd }) {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!task.trim()) return;
    await onAdd({ task, category, dueDate: dueDate || undefined });
    setTask("");
    setDueDate("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 140px 160px auto",
        gap: 8,
        marginBottom: 12
      }}
    >
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="What needs to be done?"
        style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
      >
        <option>General</option>
        <option>Work</option>
        <option>Personal</option>
        <option>Shopping</option>
      </select>
      <button type="submit" style={{ padding: "8px 14px" }}>
        Add
      </button>
    </form>
  );
}
