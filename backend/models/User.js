const {DataTypes}=require("sequelize");
const sequelize=require("../config/db");
module.exports=sequelize.define("User",{
 name:DataTypes.STRING,
 email:{type:DataTypes.STRING,unique:true},
 password:DataTypes.STRING,
 role:{type:DataTypes.ENUM("admin","member"),defaultValue:"member"}
});
