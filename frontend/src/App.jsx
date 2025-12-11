// frontend/src/App.jsx
import { useEffect, useState } from 'react';

const API_URL = 'https://todo-fullstack-hwcr.onrender.com/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    const newTask = await res.json();
    setTasks((prev) => [...prev, newTask]);
    setTitle('');
  };

  const toggleTask = async (task) => {
    const res = await fetch(`${API_URL}/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed }),
    });
    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Todo app</h1>
      <form onSubmit={addTask} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Nhập việc cần làm..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '80%', padding: 8, marginRight: 8 }}
        />
        <button type="submit">Thêm</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 4,
            }}
          >
            <span
              onClick={() => toggleTask(task)}
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
