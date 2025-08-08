import React, { useState } from 'react';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High': return 'red';
    case 'Medium': return 'orange';
    case 'Low': return 'green';
    default: return 'gray';
  }
};

const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date().toISOString().split('T')[0];
  return dueDate < today;
};

function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState(todo.priority || 'None');
  const [editCategory, setEditCategory] = useState(todo.category || '');
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');

  const handleSave = () => {
    if (editText.trim() === '') return;
    onUpdate(todo.id, {
      text: editText.trim(),
      priority: editPriority,
      category: editCategory,
      dueDate: editDueDate
    });
    setIsEditing(false);
  };

  return (
    <li style={{
      border: '1px solid #ccc',
      marginBottom: '10px',
      padding: '10px',
      backgroundColor: todo.completed ? '#e0ffe0' : '#fff',
    }}>
      {isEditing ? (
        <>
          <input value={editText} onChange={e => setEditText(e.target.value)} />
          <select value={editPriority} onChange={e => setEditPriority(e.target.value)}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
            <option>None</option>
          </select>
          <input value={editCategory} onChange={e => setEditCategory(e.target.value)} />
          <input type="date" value={editDueDate} onChange={e => setEditDueDate(e.target.value)} />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <span
            onClick={() => onToggle(todo.id)}
            style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {todo.text}
          </span>
          <div>Priority: <span style={{ color: getPriorityColor(todo.priority) }}>{todo.priority}</span></div>
          <div>Category: {todo.category}</div>
          <div>
            Due: <span style={{ color: isOverdue(todo.dueDate) ? 'red' : 'inherit' }}>
              {todo.dueDate || 'None'}
            </span>
          </div>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(todo.id)}>Delete</button>
        </>
      )}
    </li>
  );
}

export default TodoItem;
