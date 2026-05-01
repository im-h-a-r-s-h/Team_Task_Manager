import Sidebar from "../Navbar/Navbar";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    todo: 0,
    inProgress: 0
  });

  const token = localStorage.getItem("token");
  const { dark, toggle } = useContext(ThemeContext);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/tasks/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setStats(res.data))
      .catch(err => console.log(err));
  }, [token]);

  return (
    <div className={`dash-layout ${dark ? "dark" : ""}`}>
      <Sidebar />

      <div className="dash-main">

        {/* HEADER */}
        <div className="dash-header">
          <div>
            <h1>Dashboard</h1>
            <p>Overview of your tasks and progress</p>
          </div>

          <button className="theme-btn" onClick={toggle}>
            {dark ? "Dark 🌙" : "Light ☀️"}
          </button>
        </div>

        {/* STATS */}
        <div className="stats-grid">

          <div className="stat-card total">
            <div className="icon">📊</div>
            <div>
              <h4>Total</h4>
              <p>{stats.total}</p>
            </div>
          </div>

          <div className="stat-card todo">
            <div className="icon">📝</div>
            <div>
              <h4>Todo</h4>
              <p>{stats.todo}</p>
            </div>
          </div>

          <div className="stat-card progress">
            <div className="icon">⚡</div>
            <div>
              <h4>In Progress</h4>
              <p>{stats.inProgress}</p>
            </div>
          </div>

          <div className="stat-card done">
            <div className="icon">✅</div>
            <div>
              <h4>Completed</h4>
              <p>{stats.completed}</p>
            </div>
          </div>

        </div>

        {/* CHART SECTION */}
        <div className="chart-box">
          <h2>Progress Analytics</h2>
          <div className="chart-placeholder">
            📈 Chart will be added here
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;