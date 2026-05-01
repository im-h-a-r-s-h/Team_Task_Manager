import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Navbar/Navbar";
import "./ProjectDetails.css";

export default function ProjectDetails() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);

  const [newProjectData, setNewProjectData] = useState({
    title: "",
    description: ""
  });

  const [newTask, setNewTask] = useState({
    title: "",
    assignedUserId: ""
  });

  const [loading, setLoading] = useState(false);

  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userObj?.id;
  // User is project member if they are the creator OR in the members list
  const isProjectMember = selected?.createdBy === userId || members.some(m => m.id === userId);
  const token = localStorage.getItem("token");

  const { id: projectId } = useParams();

  const headers = {
    Authorization: `Bearer ${token}`
  };

  /* FETCH PROJECTS */
  const fetchProjects = async () => {
    const res = await axios.get("http://localhost:5000/api/projects", {
      headers
    });
    return res.data;
  };

  /* LOAD DATA */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, usersRes] = await Promise.all([
          fetchProjects(),
          axios.get("http://localhost:5000/api/users", { headers })
        ]);

        setProjects(projectsRes);
        setAllUsers(usersRes.data);

        if (projectId) {
          const project = projectsRes.find(
            (p) => String(p.id) === String(projectId)
          );
          if (project) openProject(project);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token, projectId]);

  /* OPEN PROJECT */
  const openProject = async (p) => {
    setSelected(p);
    setMembers(p.Users || []);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks/project/${p.id}`,
        { headers }
      );

      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setTasks([]);
    }
  };

  /* REFRESH */
  const refreshProject = async () => {
    const updated = await fetchProjects();
    setProjects(updated);

    const current = updated.find((p) => p.id === selected?.id);
    if (current) openProject(current);
  };

  /* ADD MEMBER */
  const addMember = async (id) => {
    await axios.post(
      `http://localhost:5000/api/projects/${selected.id}/add-member`,
      { userId: id },
      { headers }
    );

    refreshProject();
  };

  /* REMOVE MEMBER */
  const removeMember = async (id) => {
    await axios.post(
      `http://localhost:5000/api/projects/${selected.id}/remove-member`,
      { userId: id },
      { headers }
    );

    refreshProject();
  };

  /* CREATE PROJECT */
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/projects",
        newProjectData,
        { headers }
      );

      setNewProjectData({ title: "", description: "" });
      setShowCreateProject(false);
      setProjects(await fetchProjects());
    } catch (err) {
      console.error(err);
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
          projectId: selected.id
        },
        { headers }
      );

      setNewTask({ title: "", assignedUserId: "" });
      setShowCreateTask(false);
      openProject(selected);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* UPDATE TASK */
  const updateTaskStatus = async (taskId, status) => {
    await axios.put(
      `http://localhost:5000/api/tasks/${taskId}`,
      { status },
      { headers }
    );

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status } : t
      )
    );
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="project-container">

        {/* LEFT */}
        <div className="project-list">
          <h3>Projects</h3>

          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => openProject(p)}
              className="project-item"
            >
              {p.title}
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="project-main">

          {!selected && <h2>Select a Project</h2>}

          {selected && (
            <>
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>

              {/* ADMIN PANEL - Visible to all project members */}
              {isProjectMember && (
                <div className="admin-panel">

                  <button onClick={() => setShowCreateProject(!showCreateProject)}>
                    Create Project
                  </button>

                  <button onClick={() => setShowCreateTask(!showCreateTask)}>
                    Create Task
                  </button>

                  {/* PROJECT FORM */}
                  {showCreateProject && (
                    <form onSubmit={handleCreateProject}>
                      <input
                        placeholder="Title"
                        value={newProjectData.title}
                        onChange={(e) =>
                          setNewProjectData({
                            ...newProjectData,
                            title: e.target.value
                          })
                        }
                      />

                      <textarea
                        placeholder="Description"
                        value={newProjectData.description}
                        onChange={(e) =>
                          setNewProjectData({
                            ...newProjectData,
                            description: e.target.value
                          })
                        }
                      />

                      <button type="submit">
                        {loading ? "Creating..." : "Create"}
                      </button>
                    </form>
                  )}

                  {/* TASK FORM */}
                  {showCreateTask && (
                    <form onSubmit={handleCreateTask}>
                      <input
                        placeholder="Task title"
                        value={newTask.title}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            title: e.target.value
                          })
                        }
                      />

                      <select
                        value={newTask.assignedUserId}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            assignedUserId: e.target.value
                          })
                        }
                      >
                        <option value="">Assign</option>
                        {members.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>

                      <button type="submit">
                        Create Task
                      </button>
                    </form>
                  )}

                  {/* MEMBERS */}
                  <div>
                    <h4>Add Member</h4>
                    <select
                      onChange={(e) => {
                        if (e.target.value) addMember(e.target.value);
                      }}
                    >
                      <option>Select</option>
                      {allUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>

                    <h4>Remove Member</h4>
                    <select
                      onChange={(e) => {
                        if (e.target.value) removeMember(e.target.value);
                      }}
                    >
                      <option>Select</option>
                      {members.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* TASKS */}
              <div>
                <h3>Tasks</h3>

                {tasks.map((t) => (
                  <div key={t.id}>
                    <b>{t.title}</b> - {t.status}

                    {(isProjectMember ||
                      t.assignedUserId === userId) && (
                      <select
                        value={t.status}
                        onChange={(e) =>
                          updateTaskStatus(t.id, e.target.value)
                        }
                      >
                        <option value="todo">todo</option>
                        <option value="in-progress">in-progress</option>
                        <option value="done">done</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>

            </>
          )}

        </div>
      </div>
    </div>
  );
}
