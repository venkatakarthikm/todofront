import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../utils/config";
import "../css/styles.css";

const TaskList = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${config}/tasks`, {
        params: { userId: user._id },
      });
      setTasks(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const response = await axios.post(`${config}/tasks`, {
        title: newTaskTitle,
        description: newTaskDescription,
        priority: newTaskPriority,
        userId: user._id,
      });
      // Optimistically add the new task to the UI
      setTasks([...tasks, response.data]);
      // Clear the form
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskPriority("Medium");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleComplete = async (taskId) => {
    // Find the task to toggle
    const taskToToggle = tasks.find((t) => t._id === taskId);
    if (!taskToToggle) return;
    // Optimistically update UI first
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    try {
      await axios.put(`${config}/tasks/${taskId}`, {
        completed: !taskToToggle.completed,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      // Revert the optimistic update if the API call fails
      setTasks(tasks);
    }
  };

  const deleteTask = async (taskId) => {
    // Optimistically remove from UI first
    const filteredTasks = tasks.filter((task) => task._id !== taskId);
    setTasks(filteredTasks);
    try {
      await axios.delete(`${config}/tasks/${taskId}`);
    } catch (error) {
      console.error("Error deleting task:", error);
      // Revert the optimistic deletion if the API call fails
      fetchTasks();
    }
  };

  const clearCompleted = async () => {
    const completedTaskIds = tasks
      .filter((task) => task.completed)
      .map((task) => task._id);
    if (completedTaskIds.length === 0) return;
    // Optimistically update UI first
    const activeTasks = tasks.filter((task) => !task.completed);
    setTasks(activeTasks);
    try {
      // In a real app, you might want to implement a batch delete endpoint
      // For now, we'll delete them one by one
      await Promise.all(
        completedTaskIds.map((id) => axios.delete(`${config}/tasks/${id}`))
      );
    } catch (error) {
      console.error("Error clearing completed tasks:", error);
      fetchTasks(); // Refresh the list on error
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    if (filter === "Active") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  // Statistics calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const remainingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const priorityCounts = tasks.reduce(
    (acc, task) => {
      acc[task.priority]++;
      return acc;
    },
    { Low: 0, Medium: 0, High: 0 }
  );

  return (
    <div className="container">
      {error && (
        <div style={styles.errorMessage}>
          {error}
          <button onClick={fetchTasks} style={styles.retryButton}>
            Retry
          </button>
        </div>
      )}
      {/* Add New Task */}
      <div className="card fade-in" style={styles.addTaskCard}>
        <h2>Add New Task</h2>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="input"
        />
        <textarea
          placeholder="Description (optional)"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          className="textarea"
        />
        <div style={styles.selectContainer}>
          <label htmlFor="priority" style={styles.selectLabel}>Priority:</label>
          <select
            id="priority"
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            className="select"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <button onClick={addTask} className="add-button">
          Add Task
        </button>
      </div>
      {/* Task Completion Stats */}
      <div className="card fade-in" style={{ animationDelay: "0.1s" }}>
        <h3>Task Completion</h3>
        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: `${completionPercentage}%`,
              backgroundColor:
                completionPercentage === 100
                  ? "#27ae60"
                  : completionPercentage >= 50
                  ? "#f39c12"
                  : "#e74c3c",
            }}
          ></div>
        </div>
        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Total</span>
            <span style={styles.statValue}>{totalTasks}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Completed</span>
            <span style={styles.statValue}>{completedTasks}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Remaining</span>
            <span style={styles.statValue}>{remainingTasks}</span>
          </div>
        </div>
        <div style={styles.priorityStats}>
          <div style={{ ...styles.priorityItem, color: "#e74c3c" }}>
            <span style={styles.priorityDot} className="high"></span>
            <span>High: {priorityCounts.High}</span>
          </div>
          <div style={{ ...styles.priorityItem, color: "#f39c12" }}>
            <span style={styles.priorityDot} className="medium"></span>
            <span>Medium: {priorityCounts.Medium}</span>
          </div>
          <div style={{ ...styles.priorityItem, color: "#27ae60" }}>
            <span style={styles.priorityDot} className="low"></span>
            <span>Low: {priorityCounts.Low}</span>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="filters fade-in" style={{ animationDelay: "0.2s" }}>
        <button
          className={`filter-button ${filter === "All" ? "active" : ""}`}
          onClick={() => setFilter("All")}
        >
          All
        </button>
        <button
          className={`filter-button ${filter === "Active" ? "active" : ""}`}
          onClick={() => setFilter("Active")}
        >
          Active
        </button>
        <button
          className={`filter-button ${filter === "Completed" ? "active" : ""}`}
          onClick={() => setFilter("Completed")}
        >
          Completed
        </button>
        <button className="clear-button" onClick={clearCompleted}>
          Clear completed
        </button>
      </div>
      {/* Task List */}
      <div className="card fade-in" style={{ animationDelay: "0.3s" }}>
        <h2>My Tasks</h2>
        {isLoading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div style={styles.emptyState}>
            <svg
              style={styles.emptyIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <p>
              {filter === "All"
                ? "You have no tasks yet. Add your first task!"
                : filter === "Active"
                ? "No active tasks. Great job!"
                : "No completed tasks yet."}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task._id} className="task-item slide-in">
              <label style={styles.taskLabel}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task._id)}
                />
                <span
                  style={{
                    ...styles.taskText,
                    textDecoration: task.completed ? "line-through" : "none",
                    color: task.completed ? "#95a5a6" : "#2c3e50",
                  }}
                >
                  {task.title}
                </span>
              </label>
              <div style={styles.taskActions}>
                <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="delete-button"
                >
                  🗑️
                </button>
              </div>
              {/* Display creation and completion timestamps */}
              <div style={styles.timestamps}>
                <p>
                  <strong>Created:</strong> {formatDate(task.createdAt)}
                </p>
                {task.completed && (
                  <p>
                    <strong>Completed:</strong> {formatDate(task.completedAt)}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  addTaskCard: {
    borderTop: "4px solid #3498db",
  },
  selectContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  selectLabel: {
    marginRight: "10px",
    fontWeight: "500",
  },
  statsContainer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "15px 0",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statLabel: {
    fontSize: "14px",
    color: "#7f8c8d",
    marginBottom: "5px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  priorityStats: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    flexWrap: "wrap", // For mobile
  },
  priorityItem: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "14px",
  },
  priorityDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  taskLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1,
  },
  taskText: {
    transition: "all 0.3s ease",
  },
  taskActions: {
    display: "flex",
    alignItems: "center",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 0",
  },
  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "50%",
    borderTop: "3px solid #3498db",
    animation: "spin 1s linear infinite",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 0",
    color: "#95a5a6",
  },
  emptyIcon: {
    width: "40px",
    height: "40px",
    marginBottom: "15px",
    color: "#bdc3c7",
  },
  errorMessage: {
    backgroundColor: "rgba(231, 76, 60, 0.1)",
    color: "#e74c3c",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  retryButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "6px 12px",
    fontSize: "14px",
    cursor: "pointer",
  },
  timestamps: {
    marginTop: "5px",
    fontSize: "12px",
    color: "#7f8c8d",
  },
};

export default TaskList;