import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("todos"));
    if (saved) setTodos(saved);
  }, []);

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddOrUpdate = () => {
    if (!input.trim()) {
      alert("Task cannot be empty");
      return;
    }

    const duplicate = todos.some(
      (t) => t.text.toLowerCase() === input.toLowerCase() && t.id !== editId
    );
    if (duplicate) {
      alert("This task already exists");
      return;
    }

    if (editId) {
      setTodos(todos.map((t) => (t.id === editId ? { ...t, text: input } : t)));
      setEditId(null);
    } else {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
    }
    setInput("");
  };

  const handleDelete = (id) => setTodos(todos.filter((t) => t.id !== id));

  const handleEdit = (todo) => {
    setInput(todo.text);
    setEditId(todo.id);
  };

  const toggleComplete = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  return (
    <div className="todo-wrapper">
      <div className="todo-container">
        <h1>My Todo List</h1>

        <div className="input-box">
          <input
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleAddOrUpdate}>{editId ? "Update" : "Add"}</button>
        </div>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? "done" : ""}>
              <span onClick={() => toggleComplete(todo.id)}>{todo.text}</span>
              <div className="actions">
                <button onClick={() => handleEdit(todo)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(todo.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
