const express = require('express');
const router = express.Router();
const { Project, User } = require('../models');
const auth = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

// Helper: Check if user is member of the project (creator or added member)
const isProjectMember = async (projectId, userId) => {
  const project = await Project.findByPk(projectId);

  if (!project) return false;

  // Creator always allowed
  if (project.createdBy === userId) return true;

  // Check if user is in the project's users
  const users = await project.getUsers({
    attributes: ['id']
  });

  const memberIds = users.map(u => u.id);
  return memberIds.includes(userId);
};

// CREATE PROJECT
router.post('/', auth, async (req, res) => {
  try {
    const project = await Project.create({
      title: req.body.title,
      description: req.body.description,
      createdBy: req.user.id
    });

    // ✅ FIX: Add creator as member
    await project.addUser(req.user.id);

    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: "Error creating project" });
  }
});

// GET USER PROJECTS
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: {
        [Op.or]: [
          { createdBy: req.user.id },
          { '$Users.id$': req.user.id }
        ]
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
          through: { attributes: [] },
          required: false // ✅ FIX: ensures join works properly
        }
      ]
    });

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching projects" });
  }
});

// ADD MEMBER
router.post('/:id/add-member', auth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    const user = await User.findByPk(req.body.userId);

    if (!project || !user) {
      return res.status(404).json({ msg: "Project or user not found" });
    }

    const isMember = await isProjectMember(req.params.id, req.user.id);
    if (!isMember) {
      return res.status(403).json({ msg: "Only project members can add members" });
    }

    // Prevent duplicate
    const existing = await project.getUsers({
      where: { id: user.id }
    });

    if (existing.length > 0) {
      return res.status(400).json({ msg: "User already in project" });
    }

    await project.addUser(user);

    // Return updated project
    const updatedProject = await Project.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    res.json(updatedProject);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error adding member" });
  }
});

// REMOVE MEMBER
router.post('/:id/remove-member', auth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    const user = await User.findByPk(req.body.userId);

    if (!project || !user)
      return res.status(404).json({ msg: "Project or user not found" });

    const isMember = await isProjectMember(req.params.id, req.user.id);
    if (!isMember) {
      return res.status(403).json({ msg: "Only project members can remove members" });
    }

    await project.removeUser(user);

    // Return updated project
    const updatedProject = await Project.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    res.json(updatedProject);

  } catch (err) {
    res.status(500).json({ msg: "Error removing member" });
  }
});

module.exports = router;