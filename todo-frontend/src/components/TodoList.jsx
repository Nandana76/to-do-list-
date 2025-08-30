import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return <p>No todos yet. Add one above!</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {todos.map((t) => (
        <TodoItem key={t._id} todo={t} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}
