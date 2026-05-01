const r=require("express").Router();
const {User}=require("../models");

r.get("/",async(req,res)=>{
 const users=await User.findAll({attributes:["id","name"]});
 res.json(users);
});

module.exports=r;
