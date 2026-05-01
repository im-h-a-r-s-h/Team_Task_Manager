const { Sequelize } = require("sequelize");

module.exports = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: false
});