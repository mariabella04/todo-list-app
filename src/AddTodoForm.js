import React, { useState } from 'react';

function AddTodoForm({ onAddTodo }) {
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');

  const categories = ['Work', 'Personal', 'Shopping', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onAddTodo({
      id: Date.now(),
      text: inputText.trim(),
      priority,
      category,
      dueDate,
      completed: false
    });

    setInputText('');
    setPriority('Medium');
    setCategory('Work');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Add new todo"
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddTodoForm;
