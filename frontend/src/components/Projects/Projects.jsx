import Sidebar from "../Navbar/Navbar";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import "./Projects.css";
import ProjectPieChart from "../charts/PieChart";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAssignUser, setShowAssignUser] = useState(false);
  
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [newTask, setNewTask] = useState({ title: "", assignedUserId: "" });
  const [loading, setLoading] = useState(false);

const token = localStorage.getItem("token");
  // Get role from localStorage - check both direct role and user object
  const directRole = localStorage.getItem("role");
  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  const role = directRole || userObj?.role || "member";
  const userId = userObj?.id;
  const [searchParams] = useSearchParams();
  const urlProjectId = searchParams.get("id");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  /* FETCH PROJECTS */
  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/projects", {
        headers
      });
      setProjects(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  }, [token]);

  /* FETCH ALL USERS */
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users", {
        headers
      });
      setAllUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const chartData = [
  {
    name: "Todo",
    value: tasks.filter(t => t.status === "todo").length
  },
  {
    name: "In Progress",
    value: tasks.filter(t => t.status === "in-progress").length
  },
  {
    name: "Done",
    value: tasks.filter(t => t.status === "done").length
  }
];

/* INITIAL LOAD - Load projects and users on mount (no id in URL) */
  useEffect(() => {
    const loadData = async () => {
      await fetchProjects();
      await fetchAllUsers();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* HANDLE URL PARAMETER CHANGE - Fixed to properly handle /projects?id= URL parameter */
  useEffect(() => {
    const initLoad = async () => {
      // Fetch projects and users first
      const projectsData = await fetchProjects();
      await fetchAllUsers();

      // If URL has project ID, select it - do this after data is loaded
      if (urlProjectId && projectsData.length > 0) {
        const project = projectsData.find(p => String(p.id) === String(urlProjectId));
        if (project) {
          selectProject(project);
        }
      }
    };
    initLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlProjectId]);

  /* SELECT PROJECT */
  const selectProject = async (project) => {
    setSelectedProject(project);
    setMembers(project.Users || []);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks/project/${project.id}`,
        { headers }
      );
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    }
  };

  /* CREATE PROJECT */
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/projects", newProject, {
        headers
      });

      setNewProject({ title: "", description: "" });
      setShowCreateForm(false);
      const updatedProjects = await fetchProjects();
      
      // Select the newly created project
      if (updatedProjects.length > 0) {
        selectProject(updatedProjects[updatedProjects.length - 1]);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  /* CREATE TASK */
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        {
          ...newTask,
          projectId: selectedProject.id
        },
        { headers }
      );

      setNewTask({ title: "", assignedUserId: "" });
      setShowCreateTask(false);
      
      // Refresh tasks
      const res = await axios.get(
        `http://localhost:5000/api/tasks/project/${selectedProject.id}`,
        { headers }
      );
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error creating task:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ASSIGN USER TO PROJECT */
  const assignUser = async (userId) => {
    if (!userId) return;
    
    try {
      await axios.post(
        `http://localhost:5000/api/projects/${selectedProject.id}/add-member`,
        { userId },
        { headers }
      );

      // Refresh project to get updated members
      const updatedProjects = await fetchProjects();
      const updated = updatedProjects.find(p => p.id === selectedProject.id);
      if (updated) {
        setSelectedProject(updated);
        setMembers(updated.Users || []);
      }
      setShowAssignUser(false);
    } catch (err) {
      console.error("Error assigning user:", err);
    }
  };

  /* REMOVE USER FROM PROJECT */
  const removeUser = async (userId) => {
    if (!userId) return;
    
    try {
      await axios.post(
        `http://localhost:5000/api/projects/${selectedProject.id}/remove-member`,
        { userId },
        { headers }
      );

      // Refresh project to get updated members
      const updatedProjects = await fetchProjects();
      const updated = updatedProjects.find(p => p.id === selectedProject.id);
      if (updated) {
        setSelectedProject(updated);
        setMembers(updated.Users || []);
      }
    } catch (err) {
      console.error("Error removing user:", err);
    }
  };

  /* UPDATE TASK STATUS */
  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { status },
        { headers }
      );

      setTasks(prev =>
        prev.map(t =>
          t.id === taskId ? { ...t, status } : t
        )
      );
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  /* GET STATUS CLASS */
  const getStatusClass = (status) => {
    switch (status) {
      case "todo": return "status-todo";
      case "in-progress": return "status-in-progress";
      case "done": return "status-done";
      default: return "status-todo";
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main projects-page">
        

        {/* RIGHT SIDE - PROJECT DETAILS */}
        <div className="project-details-panel">
          {!selectedProject ? (
            <div className="no-selection">
              <h2>Select a Project</h2>
              <p>Click on a project from the list to view details</p>
            </div>
          ) : (
            <>
              <div className="project-header">
                <div>
                  <h2>{selectedProject.title}</h2>
                  <p>{selectedProject.description}</p>
                </div>
              </div>

              {/* ADMIN: Task & Member Management */}
              {role === "admin" && (
                <div className="admin-panel">
                  <div className="admin-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowCreateTask(!showCreateTask)}
                    >
                      {showCreateTask ? "Cancel" : "+ Create Task"}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowAssignUser(!showAssignUser)}
                    >
                      {showAssignUser ? "Cancel" : "+ Assign User"}
                    </button>
                  </div>

                  {/* PROJECT PROGRESS PIE CHART */}
<div className="project-chart-box">
  <h4>Project Progress</h4>
  <ProjectPieChart data={chartData} />
</div>

                  {/* CREATE TASK FORM */}
                  {showCreateTask && (
                    <div className="task-form card">
                      <h4>Create New Task</h4>
                      <form onSubmit={handleCreateTask}>
                        <input
                          type="text"
                          placeholder="Task Title"
                          className="input"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          required
                        />
                        <select
                          className="input"
                          value={newTask.assignedUserId}
                          onChange={(e) => setNewTask({ ...newTask, assignedUserId: e.target.value })}
                        >
                          <option value="">Select Assignee (Optional)</option>
                          {members.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                          Create Task
                        </button>
                      </form>
                    </div>
                  )}

                  {/* ASSIGN USER FORM */}
                  {showAssignUser && (
                    <div className="assign-form card">
                      <h4>Assign User to Project</h4>
                      <select
                        className="input"
                        onChange={(e) => assignUser(e.target.value)}
                      >
                        <option value="">Select User</option>
                        {allUsers
                          .filter(u => !members.find(m => m.id === u.id))
                          .map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                          ))}
                      </select>
                    </div>
                  )}

                  {/* REMOVE MEMBERS */}
                  <div className="remove-members">
                    <h4>Manage Members</h4>
                    <div className="members-list">
                      {members.map(m => (
                        <div key={m.id} className="member-tag">
                          <span>{m.name}</span>
                          <button
                            className="btn-remove"
                            onClick={() => removeUser(m.id)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TASKS SECTION */}
              <div className="tasks-section">
                <h3>Tasks ({tasks.length})</h3>
                
                {tasks.length === 0 ? (
                  <p className="no-tasks">No tasks yet</p>
                ) : (
                  <div className="tasks-list">
                    {tasks.map(t => (
                      <div key={t.id} className="task-card">
                        <div className="task-header">
                          <h4>{t.title}</h4>
                          <span className={`status ${getStatusClass(t.status)}`}>
                            {t.status}
                          </span>
                        </div>
                        
                        {/* ASSIGNEE INFO */}
                        {t.assignedUserId && (
                          <p className="assignee">
                            Assigned to: {members.find(m => m.id === t.assignedUserId)?.name || 'Unknown'}
                          </p>
                        )}

                        {/* STATUS UPDATE - Admin or Assigned User Only */}
                        {(role === "admin" || t.assignedUserId === userId) && (
                          <div className="task-actions">
                            <select
                              className="status-select"
                              value={t.status}
                              onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                            >
                              <option value="todo">Todo</option>
                              <option value="in-progress">In Progress</option>
                              <option value="done">Done</option>
                            </select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
