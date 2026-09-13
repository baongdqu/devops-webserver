import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [backendStatus, setBackendStatus] = useState('Checking...');

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then(res => res.json())
      .then(data => setBackendStatus(`Online (${data.status})`))
      .catch(() => setBackendStatus('Offline / Disconnected'));

    fetchTodos();
  }, [API_BASE]);

  const fetchTodos = () => {
    fetch(`${API_BASE}/api/todos`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setTodos(data.data);
      })
      .catch(err => console.error(err));
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    fetch(`${API_BASE}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTodos([...todos, data.data]);
          setNewTitle('');
        }
      });
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🚀 DevOps & GitOps Demo App</h1>
        <div className="status-badge">
          Backend API: <span className={backendStatus.includes('Online') ? 'online' : 'offline'}>{backendStatus}</span>
        </div>
      </header>

      <main className="main-content">
        <div className="card">
          <h2>DevOps Task Checklist</h2>
          <form onSubmit={handleAddTodo} className="todo-form">
            <input
              type="text"
              placeholder="Add new DevOps task..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <button type="submit">Add Task</button>
          </form>

          <ul className="todo-list">
            {todos.map(todo => (
              <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                <span>{todo.title}</span>
                <span className="badge">{todo.completed ? 'Done ✅' : 'In Progress ⏳'}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
