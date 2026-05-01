const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { sequelize } = require("./models");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;

// DB + SERVER START
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    await sequelize.sync(); // safe for your project (MVP stage)

    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });

  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};

startServer();