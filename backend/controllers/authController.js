const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const {User}=require("../models");

exports.signup=async(req,res)=>{
 try{
  const {name,email,password}=req.body;

  if(!name||!email||!password)
    return res.status(400).json({msg:"All fields required"});

  if(password.length<6)
    return res.status(400).json({msg:"Password min 6 chars"});

  const exist=await User.findOne({where:{email}});
  if(exist) return res.status(400).json({msg:"Email exists"});

  const hash=await bcrypt.hash(password,10);
  const user=await User.create({name,email,password:hash});

  res.json({msg:"Signup success"});
 }catch(e){
  res.status(500).json({msg:"Server error"});
 }
};

exports.login=async(req,res)=>{
 try{
  const {email,password}=req.body;

  if(!email||!password)
    return res.status(400).json({msg:"All fields required"});

  const user=await User.findOne({where:{email}});
  if(!user) return res.status(404).json({msg:"User not found"});

  const valid=await bcrypt.compare(password,user.password);
  if(!valid) return res.status(401).json({msg:"Wrong password"});

  const token=jwt.sign(
   {id:user.id,role:user.role},
   process.env.JWT_SECRET,
   {expiresIn:"1h"}
  );

  res.json({token,user});
 }catch(e){
  res.status(500).json({msg:"Server error"});
 }
};
