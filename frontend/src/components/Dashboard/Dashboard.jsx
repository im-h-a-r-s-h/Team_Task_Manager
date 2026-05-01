import Sidebar from "../Navbar/Navbar";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {ThemeContext} from "../../context/ThemeContext.jsx";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    todo: 0
  });

  const token = localStorage.getItem("token");
  const { dark, toggle } = useContext(ThemeContext);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/tasks/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setStats(res.data || { total: 0, completed: 0, todo: 0 }))
      .catch(err => console.log(err));
  }, [token]);

  return (
    <div className={`layout ${dark ? "dark-bg" : ""}`}>
      <Sidebar />

      <div className="main dashboard">

        {/* TOP BAR */}
        <div className="topbar">
          <h2>Dashboard</h2>

          <button
            className={`dark-toggle ${dark ? "active" : ""}`}
            onClick={toggle}
          >
            {dark ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="stats-container">

          <div className="stat-card total">
            <h3>Total Tasks</h3>
            <p>{stats.total}</p>
          </div>

          <div className="stat-card done">
            <h3>Completed</h3>
            <p>{stats.completed}</p>
          </div>

          <div className="stat-card todo">
            <h3>Todo</h3>
            <p>{stats.todo}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;