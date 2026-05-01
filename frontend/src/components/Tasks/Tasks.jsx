import Sidebar from "../Navbar/Navbar";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import "./Tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const { dark, toggle } = useContext(ThemeContext);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers,
      });

      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const updateStatus = async (id, status) => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { status },
        { headers }
      );

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status } : t
        )
      );
    } catch (err) {
      console.error("Error updating task:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "done":
        return "status-done";
      case "in-progress":
        return "status-in-progress";
      default:
        return "status-todo";
    }
  };

  return (
    <div className={`dash-layout ${dark ? "dark" : ""}`}>
      <Sidebar />

      <div className="tasks-page">

        {/* HEADER (same as dashboard style) */}
        <div className="dash-header">
          <div>
            <h1>Tasks</h1>
            <p>All assigned tasks overview</p>
          </div>

          <button className="theme-btn" onClick={toggle}>
            {dark ? "Dark 🌙" : "Light ☀️"}
          </button>
        </div>

        {/* TASK CONTENT */}
        {tasks.length === 0 ? (
          <div className="no-tasks">
            No tasks found for your projects
          </div>
        ) : (
          <div className="tasks-list">
            {tasks.map((t) => (
              <div className="task-card" key={t.id}>
                <div className="task-info">
                  <h4>{t.title}</h4>

                  {t.Project && (
                    <span className="project-name">
                      {t.Project.title}
                    </span>
                  )}

                  <span
                    className={`status-badge ${getStatusClass(
                      t.status
                    )}`}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="task-actions">
                  <select
                    value={t.status}
                    onChange={(e) =>
                      updateStatus(t.id, e.target.value)
                    }
                    disabled={loading}
                    className="status-select"
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Tasks;