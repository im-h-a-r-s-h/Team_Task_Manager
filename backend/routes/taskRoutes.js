const express = require('express');
const router = express.Router();
const { Task, User, Project } = require('../models');
const auth = require('../middleware/authMiddleware');

// CREATE TASK
router.post('/', auth, async (req, res) => {
  try {
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
    // Get all projects the user is a member of
    const user = await User.findByPk(req.user.id);
    const userProjects = await user.getProjects();
    const projectIds = userProjects.map(p => p.id);
    
    // Find tasks for those projects
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
    const tasks = await Task.findAll({
      where: { projectId: req.params.id },
      include: [{ model: User, as: 'assignedUser', attributes: ['name'] }]
    });
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks by project:', err);
    res.status(500).json({ msg: "Error fetching tasks" });
  }
});

// GET MY TASKS ONLY
router.get('/my', auth, async (req, res) => {
  const tasks = await Task.findAll({
    where: { assignedUserId: req.user.id },
    include: [{ model: User, as: 'assignedUser', attributes: ['name'] }]
  });
  res.json(tasks);
});

// UPDATE TASK STATUS
router.put('/:id', auth, async (req, res) => {
  const task = await Task.findByPk(req.params.id);

  if (!task) return res.status(404).json({ msg: "Not found" });

  if (task.assignedUserId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ msg: "Not allowed" });
  }

  task.status = req.body.status;
  await task.save();

  res.json(task);
});

// DASHBOARD STATS (FIX 404 ERROR)
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const userProjects = await user.getProjects();
    const projectIds = userProjects.map(p => p.id);

    const total = await Task.count({
      where: { projectId: projectIds }
    });

    const completed = await Task.count({
      where: {
        projectId: projectIds,
        status: 'done'
      }
    });

    const todo = await Task.count({
      where: {
        projectId: projectIds,
        status: 'todo'
      }
    });

    const inProgress = await Task.count({
      where: {
        projectId: projectIds,
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
