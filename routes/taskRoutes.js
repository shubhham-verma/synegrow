const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');

router.post('/tasks/create', taskController.createTask);
router.get('/tasks/get', taskController.getAllTasks);
router.get('/tasks/get/:id', taskController.getTaskByID);
router.put('/tasks/update/:id', taskController.updateTaskByID);
router.delete('/tasks/delete/:id', taskController.deleteTaskByID);
router.get('/tasks/search', taskController.searchTasks);




module.exports = router;