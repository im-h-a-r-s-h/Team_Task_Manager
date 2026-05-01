const {DataTypes}=require("sequelize");
const sequelize=require("../config/db");
module.exports=sequelize.define("Task",{
 title:DataTypes.STRING,
 status:{type:DataTypes.ENUM("todo","in-progress","done"),defaultValue:"todo"},
 projectId:DataTypes.INTEGER,
 assignedUserId:DataTypes.INTEGER
});
