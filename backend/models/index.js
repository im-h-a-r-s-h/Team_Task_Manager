const sequelize = require("../config/db");
const User = require("./User");
const Project = require("./Project");
const Task = require("./Task");
const Team = require("./Team");

// associations
User.belongsToMany(Project, { through: Team });
Project.belongsToMany(User, { through: Team });

Project.hasMany(Task, { foreignKey: 'projectId' });
Task.belongsTo(Project, { foreignKey: 'projectId' });

User.hasMany(Task, { foreignKey: 'assignedUserId' });
Task.belongsTo(User, { as: 'assignedUser', foreignKey: 'assignedUserId' });

// ✅ IMPORTANT FIX
module.exports = {
  sequelize,
  User,
  Project,
  Task,
  Team
};
