const {DataTypes}=require("sequelize");
const sequelize=require("../config/db");

const Team=sequelize.define("Team",{});
module.exports=Team;
