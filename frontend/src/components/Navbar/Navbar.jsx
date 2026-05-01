import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Navbar.css";

const Sidebar = () => {
  const nav = useNavigate();

  const userObj = JSON.parse(localStorage.getItem("user") || "{}");

  const [projects, setProjects] = useState([]);
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);

  // ⭐ ACTIVE PROJECT STATE
  const [activeProjectId, setActiveProjectId] = useState(
    localStorage.getItem("activeProjectId")
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/projects`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const logout = () => {
    localStorage.clear();
    nav("/");
  };

  const handleProjectClick = (projectId) => {
    nav(`/projects?id=${projectId}`);
    setActiveProjectId(projectId);

    // ⭐ persist active project
    localStorage.setItem("activeProjectId", projectId);

    setShowProjectsDropdown(false);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/projects`, newProject, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const response = await axios.get(`http://localhost:5000/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProjects(response.data);

      setNewProject({ title: "", description: "" });
      setShowCreateProject(false);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sidebar">

      <h3 className="logo">TaskApp</h3>

      <Link to="/dashboard">Dashboard</Link>
      <Link to="/tasks">Tasks</Link>

      {/* PROJECTS */}
      <div className="dropdown">
        <button
          className="dropdown-btn"
          onClick={() => setShowProjectsDropdown(!showProjectsDropdown)}
        >
          Projects {showProjectsDropdown ? "▲" : "▼"}
        </button>

        {showProjectsDropdown && (
          <div className="dropdown-content">

            {projects.map((project) => (
              <div
                key={project.id}
                className={`dropdown-item ${
                  Number(activeProjectId) === project.id ? "active" : ""
                }`}
                onClick={() => handleProjectClick(project.id)}
              >
                <span>{project.title}</span>

                {Number(activeProjectId) === project.id && (
                  <span className="dot">●</span>
                )}
              </div>
            ))}

            {/* CREATE PROJECT */}
              <>
                <hr />

                <div
                  className="dropdown-item create-project-btn"
                  onClick={() => setShowCreateProject(!showCreateProject)}
                >
                  + Add New Project
                </div>

                {showCreateProject && (
                  <div className="create-project-form">
                    <form onSubmit={handleCreateProject}>
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={newProject.title}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            title: e.target.value
                          })
                        }
                        required
                      />

                      <textarea
                        placeholder="Description"
                        value={newProject.description}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            description: e.target.value
                          })
                        }
                        rows="3"
                      />

                      <div className="form-buttons">
                        <button type="submit" disabled={loading}>
                          {loading ? "Creating..." : "Create"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowCreateProject(false);
                            setNewProject({ title: "", description: "" });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
          </div>
        )}
      </div>

      <button className="btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;