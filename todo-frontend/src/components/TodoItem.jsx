export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid #eee"
      }}
    >
      <span
        onClick={() => onToggle(todo._id, todo.completed)}
        title="Click to toggle"
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
          cursor: "pointer"
        }}
      >
        {todo.task}
        {todo.dueDate && (
          <small style={{ marginLeft: 8, opacity: 0.7 }}>
            ({new Date(todo.dueDate).toLocaleDateString()})
          </small>
        )}
        {todo.category && (
          <small style={{ marginLeft: 8, opacity: 0.7 }}>[{todo.category}]</small>
        )}
      </span>

      <button onClick={() => onDelete(todo._id)} title="Delete">
        ❌
      </button>
    </li>
  );
}
