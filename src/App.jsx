import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

function App() {
  const [showOptions, setShowOptions] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [selectedTaskIndexForDelete, setSelectedTaskIndexForDelete] = useState(null);
  const [editedTask, setEditedTask] = useState('');
  const [editedDeadline, setEditedDeadline] = useState(null);

  const handleAddTask = () => {
    if (newTask.trim() && deadline) {
      const newTaskObj = {
        text: newTask,
        createdAt: new Date().toLocaleString(),
        deadline: deadline.toLocaleDateString('en-US'),
        isDone: false
      };
      const updatedTasks = [...tasks, newTaskObj];
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setNewTask('');
      setDeadline(null);
      setIsModalOpen(false);
    }
  };

  const toggleTaskStatus = (index, newStatus) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, isDone: newStatus } : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    setIsUpdateModalOpen(false);
    setSelectedTaskIndex(null);
  };

  const handleDeleteTask = () => {
    if (selectedTaskIndexForDelete !== null) {
      const updatedTasks = tasks.filter((task, index) => index !== selectedTaskIndexForDelete);
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setIsDeleteModalOpen(false);
      setSelectedTaskIndexForDelete(null);
    }
  };

  const handleEditTask = () => {
    if (selectedTaskIndex !== null) {
      const taskToEdit = tasks[selectedTaskIndex];
      setEditedTask(taskToEdit.text);
      setEditedDeadline(new Date(taskToEdit.deadline));
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateEditedTask = () => {
    if (selectedTaskIndex !== null) {
      const editedTaskObj = {
        ...tasks[selectedTaskIndex],
        text: editedTask,
        deadline: editedDeadline.toLocaleDateString('en-US'),
        editedAt: new Date().toLocaleString(), 
      };
      const updatedTasks = tasks.map((task, index) =>
        index === selectedTaskIndex ? editedTaskObj : task
      );
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setIsEditModalOpen(false);
      setEditedTask('');
      setEditedDeadline(null);
      setSelectedTaskIndex(null);
    }
  };
  
  const markAllAsDone = () => {
    const updatedTasks = tasks.map(task => ({ ...task, isDone: true }));
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const markAllAsUndone = () => {
    const updatedTasks = tasks.map(task => ({ ...task, isDone: false }));
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const deleteAllTasks = () => {
    setIsDeleteAllModalOpen(true);
  };

  const confirmDeleteAllTasks = (confirm) => {
    if (confirm) {
      setTasks([]);
      saveTasksToLocalStorage([]);
    }
    setIsDeleteAllModalOpen(false);
  };

  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const handleUpdateTask = () => {
    if (selectedTaskIndex !== null) {
      setIsUpdateModalOpen(true);
    }
  };

  const handleUpdateConfirmation = (confirm) => {
    if (confirm && selectedTaskIndex !== null) {
      const task = tasks[selectedTaskIndex];
      const confirmationMessage = task.isDone ? 'Undone?' : 'Done?';
      toggleTaskStatus(selectedTaskIndex, !task.isDone);
    }
    setIsUpdateModalOpen(false);
  };  

  const handleTaskSelect = (index) => {
    setSelectedTaskIndex(index);
  };

  const today = new Date();

  return (
    <div className="app-container">
      <h1>My To-do List</h1>
      <div className="main-content">
        {showOptions && (
          <div className="task-box">
            {tasks.length === 0 ? (
              <p className="task-box-placeholder">Tasks go here...</p>
            ) : (
              tasks.map((task, index) => (
                <div
                  key={index}
                  className={`task-item ${selectedTaskIndex === index ? 'selected' : ''} ${task.isDone ? 'done' : ''}`}
                  onClick={() => handleTaskSelect(index)}
                >
                  <p>{task.text}</p>
                  <p className="task-time">Created at: {task.createdAt}</p>
                  {task.editedAt && (
                    <p className="task-modified-time">Last modified at: {task.editedAt}</p>
                  )}
                  <p className="task-deadline">Deadline: {task.deadline}</p>
                </div>
              ))
            )}
          </div>
        )}
        <div className="buttons-section">
          {!showOptions ? (
            <button className="start-button" onClick={() => setShowOptions(true)}>
              Click to Start
            </button>
          ) : (
            <>
              <button className="action-button" onClick={() => setIsModalOpen(true)}>
                Add Task
              </button>
              <button className="action-button" onClick={handleEditTask}>
                Edit Task
              </button>
              <button className="action-button" onClick={handleUpdateTask}>
                Update Task
              </button>
              <button
                className="action-button"
                onClick={() => {
                  if (selectedTaskIndex !== null) {
                    setIsDeleteModalOpen(true);
                    setSelectedTaskIndexForDelete(selectedTaskIndex);
                  }
                }}
              >
                Delete Task
              </button>
              <button className="action-button" onClick={markAllAsDone}>
                Mark All as Done
              </button>
              <button className="action-button" onClick={markAllAsUndone}>
                Mark All as Undone
              </button>
              <button className="action-button" onClick={deleteAllTasks}>
                Delete All Tasks
              </button>
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add a Task</h2>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="task-input"
              placeholder="Enter your task here"
            />
            <DatePicker
              selected={deadline}
              onChange={(date) => setDeadline(date)}
              className="task-input"
              dateFormat="MM/dd/yyyy"
              placeholderText="Select a deadline"
              minDate={today}
            />
            <button
              className="modal-button add-task-button"
              onClick={handleAddTask}
              disabled={!newTask.trim()} // Disable button if newTask is empty or only whitespace
            >
              Add Task
            </button>
            <button className="modal-button cancel-button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Task</h2>
            <input
              type="text"
              value={editedTask}
              onChange={(e) => setEditedTask(e.target.value)}
              className="task-input"
              placeholder="Enter edited task here"
            />
            <DatePicker
              selected={editedDeadline}
              onChange={(date) => setEditedDeadline(date)}
              className="task-input"
              dateFormat="MM/dd/yyyy"
              placeholderText="Select edited deadline"
              minDate={today}
            />
            <button
              className="modal-button update-task-button"
              onClick={handleUpdateEditedTask}
              disabled={!editedTask.trim()} 
            >
              Update Task
            </button>
            <button className="modal-button cancel-button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Update Task</h2>
            <p>Are you sure to {tasks[selectedTaskIndex]?.isDone ? 'mark this task as Undone?' : 'mark this task as Done?'}</p>
            <button className="modal-button update-task-status-button" onClick={() => handleUpdateConfirmation(true)}>
              Yes
            </button>
            <button className="modal-button cancel-button" onClick={() => setIsUpdateModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Delete Task</h2>
            <p>Are you sure you want to delete this task?</p>
            <button className="modal-button delete-task-button" onClick={handleDeleteTask}>
              Delete
            </button>
            <button className="modal-button cancel-button" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {isDeleteAllModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Delete All Tasks</h2>
            <p>Are you sure you want to delete all tasks?</p>
            <button className="modal-button delete-task-button" onClick={() => confirmDeleteAllTasks(true)}>
              Delete All
            </button>
            <button className="modal-button cancel-button" onClick={() => confirmDeleteAllTasks(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
