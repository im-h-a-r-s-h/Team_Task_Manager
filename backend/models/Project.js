const {DataTypes}=require("sequelize");
const sequelize=require("../config/db");
module.exports=sequelize.define("Project",{
 title:DataTypes.STRING,
 description:DataTypes.TEXT
});
