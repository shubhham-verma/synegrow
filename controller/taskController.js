const tasks = require('../models/taskModel');
const { v4: uuidv4 } = require('uuid');

// Create a new task
exports.createTask = (req, res) => {

    if (!req.body)
        res.status(400).json({ message: "Invalid format of data for task creation" });

    const reqTasks = req.body;

    reqTasks.forEach(element => {
        const newTask = {
            id: uuidv4(),
            title: element.title,
            description: element.description,
            status: element.status || "PENDING",
            createdAt: new Date(),
            updatedAt: new Date()
        }
        tasks.push(newTask);
    });

    res.status(201).json(tasks);
}

// Get all tasks
exports.getAllTasks = (req, res) => {
    res.json({ length: tasks.length, tasks: tasks });
};

// Get task by ID
exports.getTaskByID = (req, res) => {

    const targetID = req.params.id;
    const targetTask = tasks.find((t) => t.id === targetID);

    if (!targetTask)
        res.status(404).json({ message: "No task found" });
    else
        res.status(201).json(targetTask);
}

// Update task by ID
exports.updateTaskByID = (req, res) => {
    try {
        if (!req.body)
            return res.status(400).json({ message: "Invalid format of data for task updation" });

        const { title, description, status } = req.body;

        const allowedStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED"];
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: `Invalid status value. Allowed values are: ${allowedStatuses.join(" | ")}`
            });
        }

        const targetID = req.params.id;
        const targetTask = tasks.find((t) => t.id === targetID);
        if (!targetTask) {
            return res.status(404).json({ message: "No task found" }); // add return
        }


        targetTask.title = title || targetTask.title;
        targetTask.description = description || targetTask.description;
        targetTask.status = status || targetTask.status;
        targetTask.updatedAt = new Date();

        return res.status(200).json(targetTask); // use 200 for update
    } catch (error) {
        console.error("Error updating task:", error); // log for debugging
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

exports.deleteTaskByID = (req, res) => {
    const targetID = req.params.id;
    const targetTaskIndex = tasks.findIndex((t) => t.id === targetID);

    console.log(targetTaskIndex);

    if (targetTaskIndex === -1)
        res.status(404).json({ message: "No task found" });
    else {
        tasks.splice(targetTaskIndex, 1);
        res.status(201).json({ message: "Task deleted" });
    }
}
