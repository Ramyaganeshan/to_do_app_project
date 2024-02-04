const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const authRouter = require("./routes/authRoutes");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const Task = require("./models/addTaskModel");
const User = require("./models/userModel");
// const generateToken = require("./config/jwtToken");
const authenticateToken = require("./middlewares/authenticateToken");

const path = require("path");
const PORT = process.env.PORT || 8007;
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("frontView");
});

app.use("/api/user/", authRouter);

app.get("/signup", (req, res) => {
  // const token = generateToken({ id: req.body.id });
  // res.json(token);
  res.render("signup");
});

app.get("/login", (req, res) => {
  // const token = generateToken({ id: req.body.id });
  // console.log("login router : ", token);
  res.render("login");
});

app.get("/addTaskForm", authenticateToken, (req, res) => {
  res.render("addTaskForm");
});

app.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    const { email } = req.cookies;
    const tasks = await Task.find({ email: email });
    console.log("dashboard task : ", tasks);
    res.render("todoListView", { tasks: tasks });
  } catch (error) {
    console.error("Error displaying dashboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/dashboard", authenticateToken, async (req, res) => {
  try {
    const { title, startDate, deadline, priority, progress, description } =
      req.body;

    const { email } = req.cookies;

    const formatDate = (date) => {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      const [month, day, year] = new Date(date)
        .toLocaleDateString("en-US", options)
        .split("/");
      return `${year}-${month}-${day}`;
    };

    const newTask = await Task.create({
      title: title,
      startDate: formatDate(startDate),
      deadline: formatDate(deadline),
      priority: priority,
      progress: progress,
      description: description,
      email: email,
    });

    console.log("taskemailid : ", email);
    const tasks = await Task.find({ email: email });
    console.log("dashboard task : ", tasks);

    res.render("todoListView", { tasks: tasks });
  } catch (error) {
    console.error("Error handling form submission:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/dashboard/:taskId", authenticateToken, async (req, res) => {
  try {
    const { email } = req.cookies;
    const taskId = req.params.taskId;

    const task = await Task.findOne({ _id: taskId, email: email });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await Task.findByIdAndDelete(taskId);
    console.log("Task deleted successfully");

    res.json({ success: true, redirectUrl: "/dashboard" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/editTask/:taskId", authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    res.render("editTaskForm", { task });
  } catch (error) {
    console.error("Error rendering edit form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/updateTask/:taskId", authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, startDate, deadline, priority, progress, description } =
      req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        startDate,
        deadline,
        priority,
        progress,
        description,
      },
      { new: true }
    );

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/complete/:taskId", authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    res.render("completeTask", { task });
    console.log("-----------------------------", task.progress);
  } catch (error) {
    console.error("Error rendering complete page:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
