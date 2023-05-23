import React, { useState, useEffect } from 'react';
import axios from 'axios';


function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editedTodo, setEditedTodo] = useState('');
  const [filterCompleted, setFilterCompleted] = useState(false);
  const [filterUncompleted, setFilterUncompleted] = useState(false);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) {
      setTodos(storedTodos);
    } else {
      fetchTodos();
    }
  }, []);

  const fetchTodos = () => {
    axios
      .get('https://jsonplaceholder.typicode.com/todos?_limit=5')
      .then(response => {
        const fetchedTodos = response.data.map(todo => ({
          ...todo,
          isFetchedTodo: true,
        }));
        setTodos(fetchedTodos);
        localStorage.setItem('todos', JSON.stringify(fetchedTodos));
      })
      .catch(error => console.error(error));
  };

  const handleNewTodoChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleNewTodoSubmit = (event) => {
    event.preventDefault();
    const newId = todos.length + 1;
    const newTodoItem = {
      id: newId,
      title: newTodo,
      completed: false,
      isFetchedTodo: false,
    };
    const updatedTodos = [...todos, newTodoItem];
    setTodos(updatedTodos);
    setNewTodo('');
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const handleTodoDelete = (id) => {
    const filteredTodos = todos.filter(todo => todo.id !== id);
    setTodos(filteredTodos);
    localStorage.setItem('todos', JSON.stringify(filteredTodos));
  };

  const handleTodoToggle = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      } else {
        return todo;
      }
    });
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const handleEditTodo = (id, title) => {
    setEditTodoId(id);
    setEditedTodo(title);
  };

  const handleEditedTodoChange = (event) => {
    setEditedTodo(event.target.value);
  };

  const handleUpdateTodo = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, title: editedTodo };
      } else {
        return todo;
      }
    });
    setTodos(updatedTodos);
    setEditTodoId(null);
    setEditedTodo('');
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const handleCompletedFilter = () => {
    setFilterCompleted(true);
    setFilterUncompleted(false);
  };

  const handleUncompletedFilter = () => {
    setFilterCompleted(false);
    setFilterUncompleted(true);
  };

  // Apply filters to todos
  let filteredTodos = todos;
  if (filterCompleted) {
    filteredTodos = todos.filter(todo => todo.completed);
  } else if (filterUncompleted) {
    filteredTodos = todos.filter(todo => !todo.completed);
  }

  return (
    <div className="todo-app">
      <div className="todo-app__sidebar">
        <h1 className="todo-app__logo">Todo App</h1>
        <div className="todo-app__filters">
          <button onClick={handleCompletedFilter}>Completed</button>
          <button onClick={handleUncompletedFilter}>Uncompleted</button>
        </div>
        <form onSubmit={handleNewTodoSubmit}>
          <label htmlFor="new-todo">Add a new todo:</label>
          <input
            type="text"
            id="new-todo"
            value={newTodo}
            onChange={handleNewTodoChange}
          />
          <button type="submit">Add</button>
        </form>
      </div>
      <div className="todo-app__content">
        <ul className="todo-app__list">
          {filteredTodos.map(todo => (
            <li key={todo.id} className="todo-app__item">
              {editTodoId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editedTodo}
                    onChange={handleEditedTodoChange}
                  />
                  <button
                    type="button"
                    onClick={() => handleUpdateTodo(todo.id)}
                  >
                    Update
                  </button>
                </>
              ) : (
                <>
                  <label className="todo-app__item-text">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleTodoToggle(todo.id)}
                    />
                    <span
                      className={
                        "todo-app__item-text--" +
                        (todo.completed ? "completed" : "active")
                      }
                      onClick={() => handleTodoToggle(todo.id)}
                    >
                      {todo.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleEditTodo(todo.id, todo.title)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTodoDelete(todo.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoApp;