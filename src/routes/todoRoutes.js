const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/todoController');
const { auth } = require('../middleware/authMiddleware');

// Routes for todo operations
router.get('/', auth, TodoController.getTodos);
router.post('/', auth, TodoController.createTodos);
router.delete('/:id', auth, TodoController.deleteTodos);
router.put('/:id', auth, TodoController.updateTodos);

module.exports = router;
