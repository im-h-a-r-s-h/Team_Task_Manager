const express = require('express');
const router = express.Router();
const { Task, User, Project } = require('../models');
const auth = require('../middleware/authMiddleware');

// Helper: Check if user is member of the project
const isProjectMember = async (projectId, userId) => {
  const project = await Project.findByPk(projectId);
  if (!project) return false;
  if (project.createdBy === userId) return true;
  const users = await project.getUsers({ attributes: ['id'] });
  const memberIds = users.map(u => u.id);
  return memberIds.includes(userId);
};

// CREATE TASK - Allow any project member to create tasks
router.post('/', auth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.body.projectId);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // Check if user is a member of the project
    const isMember = await isProjectMember(req.body.projectId, req.user.id);
    if (!isMember) {
      return res.status(403).json({ msg: "Only project members can create tasks" });
    }

    const task = await Task.create({
      title: req.body.title,
      status: req.body.status || 'todo',
      projectId: req.body.projectId,
      assignedUserId: req.body.assignedUserId
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error creating task" });
  }
});

// GET ALL TASKS (for projects the user is a member of)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const userProjects = await user.getProjects();
    const projectIds = userProjects.map(p => p.id);
    
    const tasks = await Task.findAll({
      where: {
        projectId: projectIds
      },
      include: [
        { model: User, as: 'assignedUser', attributes: ['name'] },
        { model: Project, attributes: ['title'] }
      ]
    });
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching all tasks:", err);
    res.status(500).json({ msg: "Error fetching tasks" });
  }
});

// GET TASKS BY PROJECT
router.get('/project/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id'] }]
    });

    if (!project)
      return res.status(404).json({ msg: "Project not found" });

    const isOwner = project.createdBy === req.user.id;
    const isMember = project.Users?.some(u => u.id === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const tasks = await Task.findAll({
      where: { projectId: req.params.id },
      include: [{ model: User, as: 'assignedUser', attributes: ['name'] }]
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tasks" });
  }
});

// GET MY TASKS
router.get('/my', auth, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { assignedUserId: req.user.id },
      include: [{ model: Project, attributes: ['title'] }]
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tasks" });
  }
});

// UPDATE TASK STATUS
router.put('/:id', auth, async (req, res) => {
  const task = await Task.findByPk(req.params.id);

  if (!task)
    return res.status(404).json({ msg: "Not found" });

  const project = await Project.findByPk(task.projectId);

  // Allow owner or assigned user to update status
  const isOwner = project.createdBy === req.user.id;
  const isAssigned = task.assignedUserId === req.user.id;

  if (!isOwner && !isAssigned) {
    return res.status(403).json({ msg: "Not allowed" });
  }

  task.status = req.body.status;
  await task.save();

  res.json(task);
});

// DASHBOARD STATS
// DASHBOARD STATS (ONLY MY TASKS)
router.get('/stats', auth, async (req, res) => {
  try {
    const total = await Task.count({
      where: { assignedUserId: req.user.id }
    });

    const completed = await Task.count({
      where: {
        assignedUserId: req.user.id,
        status: 'done'
      }
    });

    const todo = await Task.count({
      where: {
        assignedUserId: req.user.id,
        status: 'todo'
      }
    });

    const inProgress = await Task.count({
      where: {
        assignedUserId: req.user.id,
        status: 'in-progress'
      }
    });

    res.json({
      total,
      completed,
      todo,
      inProgress
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching stats" });
  }
});

module.exports = router;
