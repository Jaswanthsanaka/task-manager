const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Task = require("./models/Task");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// POST - Create a task
app.post("/api/tasks", async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title
    });

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({
      message: "Error creating task",
      error: error.message
    });
  }
});

// GET - Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks",
      error: error.message
    });
  }
});
// DELETE - Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const deletedTask = await Task.findByIdAndDelete(req.params.id);
  
      if (!deletedTask) {
        return res.status(404).json({
          message: "Task not found"
        });
      }
  
      res.json({
        message: "Task deleted successfully",
        task: deletedTask
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting task",
        error: error.message
      });
    }
  });
// UPDATE - Mark task as completed/uncompleted
app.put("/api/tasks/:id", async (req, res) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        {
          completed: req.body.completed
        },
        { new: true }
      );
  
      if (!updatedTask) {
        return res.status(404).json({
          message: "Task not found"
        });
      }
  
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({
        message: "Error updating task",
        error: error.message
      });
    }
  });  

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});