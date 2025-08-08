import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import AddTodoForm from './AddTodoForm';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sortPriority, setSortPriority] = useState('None');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(Array.isArray(parsedTodos) ? parsedTodos : []);
      } catch {
        setTodos([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateTodo = (id, updatedFields) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, ...updatedFields } : todo
    ));
  };

  const priorityOrder = { High: 1, Medium: 2, Low: 3, None: 4 };

  const filteredTodos = todos.filter(todo => {
    const lowerSearch = searchText.toLowerCase();
    return (
      typeof todo.text === 'string' && todo.text.toLowerCase().includes(lowerSearch) ||
      typeof todo.category === 'string' && todo.category.toLowerCase().includes(lowerSearch) ||
      typeof todo.priority === 'string' && todo.priority.toLowerCase().includes(lowerSearch)
    );
  });

  const sortedTodos = [...filteredTodos];
  if (sortPriority === 'HighToLow') {
    sortedTodos.sort((a, b) => priorityOrder[a.priority || 'None'] - priorityOrder[b.priority || 'None']);
  } else if (sortPriority === 'LowToHigh') {
    sortedTodos.sort((a, b) => priorityOrder[b.priority || 'None'] - priorityOrder[a.priority || 'None']);
  }

  useEffect(() => {
    const lowerSearch = searchText.toLowerCase();
    const matches = todos.reduce((acc, todo) => {
      if (todo.text?.toLowerCase().includes(lowerSearch)) acc.push(todo.text);
      if (todo.category?.toLowerCase().includes(lowerSearch)) acc.push(todo.category);
      if (todo.priority?.toLowerCase().includes(lowerSearch)) acc.push(todo.priority);
      return acc;
    }, []);
    const uniqueMatches = [...new Set(matches)].slice(0, 5);
    setSuggestions(searchText.trim() ? uniqueMatches : []);
  }, [searchText, todos]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>My TODO App</h1>
      </header>

      <main>
        <AddTodoForm onAddTodo={addTodo} />

        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search todos by text, category, or priority..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          />
          {suggestions.length > 0 && (
            <ul style={{
              position: 'absolute',
              background: 'white',
              border: '1px solid #ccc',
              width: '100%',
              maxHeight: '120px',
              overflowY: 'auto',
              marginTop: 0,
              paddingLeft: '10px',
              listStyle: 'none',
              zIndex: 10,
              cursor: 'pointer',
            }}>
              {suggestions.map((s, i) => (
                <li key={i} onClick={() => {
                  setSearchText(s);
                  setSuggestions([]);
                }} style={{ padding: '5px 0' }}>{s}</li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="sortPriority">Sort by Priority:</label>
          <select
            id="sortPriority"
            value={sortPriority}
            onChange={(e) => setSortPriority(e.target.value)}
            style={{ marginLeft: '10px' }}
          >
            <option value="None">None</option>
            <option value="HighToLow">High to Low</option>
            <option value="LowToHigh">Low to High</option>
          </select>
        </div>

        {sortedTodos.length === 0 ? (
          <p>No TODOs found.</p>
        ) : (
          <ul className="todo-list">
            {sortedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
              />
            ))}
          </ul>
        )}

        <div className="todo-stats">
          <p>Total: {todos.length} | Completed: {todos.filter(t => t.completed).length}</p>
        </div>
      </main>
    </div>
  );
}

export default App;
