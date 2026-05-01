const express=require("express");
const cors=require("cors");
require("dotenv").config();
const {sequelize}=require("./models");

const app=express();
app.use(cors());
app.use(express.json());

app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/projects",require("./routes/projectRoutes"));
app.use("/api/tasks",require("./routes/taskRoutes"));
app.use("/api/users",require("./routes/userRoutes"));

sequelize.sync().then(()=>{
 app.listen(process.env.PORT,()=>console.log("Server running"));
});
