import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/api/todos`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Could not connect to backend');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo }),
      });
      const data = await response.json();
      setTodos([data, ...todos]);
      setNewTodo('');
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  // Toggle todo
  const toggleTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'PATCH',
      });
      const updated = await response.json();
      setTodos(todos.map(todo => todo.id === id ? updated : todo));
    } catch (err) {
      console.error('Error toggling todo:', err);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'DELETE',
      });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  if (loading) return <div className="App">Loading...</div>;

  return (
    <div className="App">
      <div className="container">
        <h1>Docker Todo App</h1>
        <p className="subtitle">Learning Docker with React + Express + PostgreSQL</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={addTodo} className="add-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
          />
          <button type="submit" className="add-button">Add</button>
        </form>

        <div className="todos">
          {todos.length === 0 ? (
            <p className="empty">No todos yet. Add one above!</p>
          ) : (
            todos.map(todo => (
              <div key={todo.id} className="todo-item">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className={todo.completed ? 'completed' : ''}>
                  {todo.title}
                </span>
                <button onClick={() => deleteTodo(todo.id)} className="delete-button">
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
