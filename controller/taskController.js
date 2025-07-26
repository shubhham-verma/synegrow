const Task = require('../models/taskModel');
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");

// Create a new task
exports.createTask = async (req, res) => {
    try {
        if (!req.body)
            res.status(400).json({ message: "Invalid format of data for task creation" });

        const reqTasks = req.body;

        if (!Array.isArray(reqTasks) || reqTasks.length === 0) {
            return res.status(400).json({ message: 'Invalid format of data for task creation. Expecting an array of tasks.' });
        }

        // Validate and create each task
        const createdTasks = await Promise.all(reqTasks.map(async (task) => {
            return await Task.create({
                title: task.title,
                description: task.description,
                status: task.status || 'PENDING'
            });
        }));

        res.status(201).json({
            length: createdTasks.length,
            tasks: createdTasks
        });
    } catch (error) {
        console.error('Create Task Error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Task.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            tasks: rows
        });
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        return res.status(500).json({ error: error.message });
    }
};

// Search tasks by status and title
exports.searchTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { status, title } = req.query;

        const whereClause = {};
        if (status) {
            whereClause.status = status;
        }
        if (title) {
            whereClause.title = { [Op.like]: `%${title}%` };
        }

        const { count, rows } = await Task.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            tasks: rows,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get task by ID
exports.getTaskByID = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        return res.status(200).json(task);
    } catch (error) {
        console.error('Error getting task:', error);
        return res.status(500).json({ error: error.message });
    }
};

// Update task by ID
exports.updateTaskByID = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.body)
            return res.status(401).json({ error: "Invalid request for task updation" });

        const { title, description, status } = req.body;

        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'No task found' });
        }

        const allowedStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Use one of: ${allowedStatuses.join(" | ")}` });
        }

        // Update fields if provided
        if (title) task.title = title;
        if (description) task.description = description;
        if (status) task.status = status;

        await task.save();
        return res.status(200).json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ error: error.message });
    }
};

// Delete task by ID
exports.deleteTaskByID = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.destroy();
        return res.status(201).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ error: error.message });
    }
};
