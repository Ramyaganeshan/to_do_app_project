const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  startDate: {
    type: String,
    required: true,
  },
  deadline: {
    type: String,
    required: true,
  },
  priority: String,
  progress: String,
  description: String,
  email: String,
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
