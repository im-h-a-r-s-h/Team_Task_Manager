const express = require('express');
const router = express.Router();
const { Project, User } = require('../models');
const auth = require('../middleware/authMiddleware');

// CREATE PROJECT
router.post('/', auth, async (req, res) => {
  try {
    const project = await Project.create({
      title: req.body.title,
      description: req.body.description,
      createdBy: req.user.id
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: "Error creating project" });
  }
});

// GET USER PROJECTS
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{ model: User, attributes: ['id', 'name'] }]
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ADD MEMBER
router.post('/:id/add-member', auth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    const user = await User.findByPk(req.body.userId);

    if (!project || !user) return res.status(404).json({ msg: "Project or user not found" });

    await project.addUser(user);
    res.json({ msg: "Member added" });
  } catch (err) {
    res.status(500).json({ msg: "Error adding member" });
  }
});

// REMOVE MEMBER
router.post('/:id/remove-member', auth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    const user = await User.findByPk(req.body.userId);

    if (!project || !user) return res.status(404).json({ msg: "Project or user not found" });

    await project.removeUser(user);
    res.json({ msg: "Member removed" });
  } catch (err) {
    res.status(500).json({ msg: "Error removing member" });
  }
});

module.exports = router;
