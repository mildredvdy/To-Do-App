import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEdit, FaTrashAlt, FaCheck, FaStar, FaInfoCircle } from 'react-icons/fa';
import './App.css';
import logo from './logo.png';

function App() {
  const [showOptions, setShowOptions] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [editedTask, setEditedTask] = useState('');
  const [editedDateTime, setEditedDateTime] = useState(null);
  const [editedTaskIndex, setEditedTaskIndex] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); 

  const today = new Date();

  useEffect(() => {
    if (isModalOpen) {
      setSelectedDateTime(null);
    }
    if (isEditModalOpen && editedDateTime === null) {
      setEditedDateTime(new Date());
    }
  }, [isModalOpen, isEditModalOpen, editedDateTime]);

  const handleAddTask = () => {
    if (newTask.trim() && selectedDateTime) {
      const newTaskObj = {
        text: newTask,
        createdAt: new Date().toLocaleString(),
        deadline: selectedDateTime.toLocaleString(),
        isDone: false,
        isFavorite: false,
      };
      const updatedTasks = [...tasks, newTaskObj];
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setNewTask('');
      setSelectedDateTime(null);
      setIsModalOpen(false);
    }
  };

  const handleEditClick = (index) => {
    const taskToEdit = tasks[index];
    setEditedTask(taskToEdit.text);
    setEditedDateTime(new Date(taskToEdit.deadline));
    setEditedTaskIndex(index);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (index) => {
    setSelectedTaskIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleTaskStatusClick = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].isDone = !updatedTasks[index].isDone;
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleFavoriteClick = (index) => {
    const updatedTasks = [...tasks];
    const taskToToggle = updatedTasks[index];
  
    const highestPriorityIndex = updatedTasks.findIndex(task => task.isFavorite);
  
    taskToToggle.isFavorite = !taskToToggle.isFavorite;
  
    if (taskToToggle.isFavorite) {
      updatedTasks.splice(index, 1);
      updatedTasks.unshift(taskToToggle);

    } else {
      updatedTasks.splice(index, 1);
      updatedTasks.push(taskToToggle);
    }
  
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };
  
  const handleUpdateEditedTask = () => {
    if (editedTaskIndex !== null && editedDateTime) {
      const updatedTasks = tasks.map((task, index) =>
        index === editedTaskIndex
          ? {
              ...task,
              text: editedTask,
              deadline: editedDateTime.toLocaleString(),
              editedAt: new Date().toLocaleString(),
            }
          : task
      );
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setIsEditModalOpen(false);
      setEditedTask('');
      setEditedDateTime(null);
      setEditedTaskIndex(null);
    }
  };

  const handleDeleteTask = () => {
    if (selectedTaskIndex !== null) {
      const updatedTasks = tasks.filter((task, index) => index !== selectedTaskIndex);
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setIsDeleteModalOpen(false);
      setSelectedTaskIndex(null);
    }
  };

  const handleDeleteAllTasks = () => {
    setTasks([]);
    saveTasksToLocalStorage([]);
    setIsDeleteAllModalOpen(false);
  };

  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const formatHours = (dateTime) => {
    if (!dateTime) return '12';
    let hours = dateTime.getHours() % 12;
    if (hours === 0) hours = 12;
    return hours.toString().padStart(2, '0');
  };

  const formatMinutes = (dateTime) => {
    if (!dateTime) return '00';
    return dateTime.getMinutes().toString().padStart(2, '0');
  };

  const formatAmPm = (dateTime) => {
    if (!dateTime) return 'AM';
    return dateTime.getHours() >= 12 ? 'PM' : 'AM';
  };

  const incrementHours = () => {
    const newDateTime = new Date(selectedDateTime);
    newDateTime.setHours(newDateTime.getHours() + 1);
    setSelectedDateTime(newDateTime);
  };

  const decrementHours = () => {
    const newDateTime = new Date(selectedDateTime);
    newDateTime.setHours(newDateTime.getHours() - 1);
    setSelectedDateTime(newDateTime);
  };

  const incrementMinutes = () => {
    const newDateTime = new Date(selectedDateTime);
    newDateTime.setMinutes(newDateTime.getMinutes() + 1);
    setSelectedDateTime(newDateTime);
  };

  const decrementMinutes = () => {
    const newDateTime = new Date(selectedDateTime);
    newDateTime.setMinutes(newDateTime.getMinutes() - 1);
    setSelectedDateTime(newDateTime);
  };

  const toggleAmPm = () => {
    const newDateTime = new Date(selectedDateTime);
    if (newDateTime.getHours() >= 12) {
      newDateTime.setHours(newDateTime.getHours() - 12);
    } else {
      newDateTime.setHours(newDateTime.getHours() + 12);
    }
    setSelectedDateTime(newDateTime);
  };

  const incrementHoursEdit = () => {
    const newDateTime = new Date(editedDateTime);
    newDateTime.setHours(newDateTime.getHours() + 1);
    setEditedDateTime(newDateTime);
  };

  const decrementHoursEdit = () => {
    const newDateTime = new Date(editedDateTime);
    newDateTime.setHours(newDateTime.getHours() - 1);
    setEditedDateTime(newDateTime);
  };

  const incrementMinutesEdit = () => {
    const newDateTime = new Date(editedDateTime);
    newDateTime.setMinutes(newDateTime.getMinutes() + 1);
    setEditedDateTime(newDateTime);
  };

  const decrementMinutesEdit = () => {
    const newDateTime = new Date(editedDateTime);
    newDateTime.setMinutes(newDateTime.getMinutes() - 1);
    setEditedDateTime(newDateTime);
  };

  const toggleAmPmEdit = () => {
    const newDateTime = new Date(editedDateTime);
    if (newDateTime.getHours() >= 12) {
      newDateTime.setHours(newDateTime.getHours() - 12);
    } else {
      newDateTime.setHours(newDateTime.getHours() + 12);
    }
    setEditedDateTime(newDateTime);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <img src={logo} alt="Logo" className="app-logo" />
        <span className="lexmeet-title">LexMeet</span>
      </header>
      <h1>My To-do List <FaInfoCircle className="info-button" onClick={() => setIsInfoModalOpen(true)} /></h1>
      <div className="main-content">

        {showOptions && (
          <div className="task-box">
            {tasks.length === 0 ? (
              <p className="task-box-placeholder">Tasks go here...</p>
            ) : (
              tasks.map((task, index) => (
                <div
                  key={index}
                  className={`task-item ${task.isDone ? 'done' : ''}`}
                >
                  <p>{task.text}</p>
                  <p className="task-time">Created at: {task.createdAt}</p>
                  {task.editedAt && (
                    <p className="task-edited-time">Last modified: {task.editedAt}</p>
                  )}
                  <p className="task-deadline">Deadline: {task.deadline}</p>
                  <div className="task-icons">
                    <FaStar
                      className={`task-icon star-icon ${task.isFavorite ? 'favorite' : ''}`}
                      onClick={() => handleFavoriteClick(index)}
                    />
                    <FaEdit
                      className="task-icon edit-icon"
                      onClick={() => handleEditClick(index)}
                    />
                    <FaTrashAlt
                      className="task-icon delete-icon"
                      onClick={() => handleDeleteClick(index)}
                    />
                    <FaCheck
                      className="task-icon status-icon"
                      onClick={() => handleTaskStatusClick(index)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        <div className="buttons-section">
          {!showOptions ? (
            <button className="start-button" onClick={() => setShowOptions(true)}>
              View Task Board
            </button>
          ) : (
            <div className="column">
              <button className="action-button" onClick={() => setIsModalOpen(true)}>
                Add Task
              </button>
              <button className="action-button" onClick={() => {
                const updatedTasks = tasks.map(task => ({ ...task, isDone: true }));
                setTasks(updatedTasks);
                saveTasksToLocalStorage(updatedTasks);
              }}>
                Mark All as Done
              </button>
              <button className="action-button" onClick={() => {
                const updatedTasks = tasks.map(task => ({ ...task, isDone: false }));
                setTasks(updatedTasks);
                saveTasksToLocalStorage(updatedTasks);
              }}>
                Mark All as Undone
              </button>
              <button className="action-button" onClick={() => setIsDeleteAllModalOpen(true)}>
                Delete All Tasks
              </button>
              <button className="action-button" onClick={() => setShowOptions(false)}>
                Go Back to Main Menu
              </button>
            </div>
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
            <div className="date-time-selectors">
              <DatePicker
                selected={selectedDateTime}
                onChange={(date) => setSelectedDateTime(date)}
                className="task-input"
                dateFormat="MM/dd/yyyy"
                placeholderText="Select a date"
                minDate={today}
              />
              <div className="time-controls">
                <button onClick={decrementHours}>&#9660;</button>
                <span>{selectedDateTime ? formatHours(selectedDateTime) : '00'}</span>
                <button onClick={incrementHours}>&#9650;</button>

                <span>:</span>
                <button onClick={decrementMinutes}>&#9660;</button>
                <span>{selectedDateTime ? formatMinutes(selectedDateTime) : '00'}</span>
                <button onClick={incrementMinutes}>&#9650;</button>

                <button onClick={toggleAmPm}>{selectedDateTime ? formatAmPm(selectedDateTime) : 'AM'}</button>
              </div>
            </div>
            <button className="modal-button add-button" onClick={handleAddTask}>
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
            <div className="date-time-selectors">
              <DatePicker
                selected={editedDateTime}
                onChange={(date) => setEditedDateTime(date)}
                className="task-input"
                dateFormat="MM/dd/yyyy"
                placeholderText="Select a date"
                minDate={today}
              />
              <div className="time-controls">
                <button onClick={decrementHoursEdit}>&#9660;</button>
                <span>{editedDateTime ? formatHours(editedDateTime) : '00'}</span>
                <button onClick={incrementHoursEdit}>&#9650;</button>

                <span>:</span>

                <button onClick={decrementMinutesEdit}>&#9660;</button>
                <span>{editedDateTime ? formatMinutes(editedDateTime) : '00'}</span>
                <button onClick={incrementMinutesEdit}>&#9650;</button>

                <button onClick={toggleAmPmEdit}>{editedDateTime ? formatAmPm(editedDateTime) : 'AM'}</button>
              </div>
            </div>
            <button className="modal-button add-button" onClick={handleUpdateEditedTask}>
              Save Changes
            </button>
            <button className="modal-button cancel-button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <h2>Delete Task</h2>
            <p>Are you sure you want to delete this task?</p>
            <div className="delete-buttons">
              <button className="modal-button delete-button" onClick={handleDeleteTask}>
                Delete
              </button>
              <button className="modal-button cancel-button" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteAllModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <h2>Delete All Tasks</h2>
            <p>Are you sure you want to delete all tasks?</p>
            <div className="delete-buttons">
              <button className="modal-button delete-button" onClick={handleDeleteAllTasks}>
                Delete All
              </button>
              <button className="modal-button cancel-button" onClick={() => setIsDeleteAllModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isInfoModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content info-modal">
            <h2>Information</h2>
            <p>Welcome to our To-Do List application, designed to help you manage your tasks efficiently and stay organized.
            Our mission is to provide a simple yet powerful tool to help individuals and teams track their tasks, prioritize their work, 
            and boost productivity.</p>
            <button className="modal-button cancel-button" onClick={() => setIsInfoModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
