const { TodoModel } = require("../models/mongoose");

const TodoController = {
  // Get all todos for a user
  getTodos: async (req, res) => {
    const userId = req.userId;  
    console.log(userId)
    try {

      const todos = await TodoModel.find({ userId });
      console.log(userId)
      if (!todos || todos.length === 0) {
        return res
          .status(404)
          .json({ message: "No todos found for this user" });
      } else {
        return res.status(200).json({ todos });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Error" });
    }
  },

  // Create a new todo for a user
  createTodos: async (req, res) => {
    const { title, description, deadline } = req.body;

    try {
        const newTodo = await TodoModel.create({
            userId: req.userId, // Retrieve userId from auth middleware
            title,
            description,
            deadline,
        });
        return res.status(201).json({
            message: "Todo created successfully",
            todo: newTodo,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error creating Todo" });
    }
},

deleteTodos: async (req, res) => {
    const { id } = req.params; // Get the todo ID from the request parameters

    try {
        const deletedTodo = await TodoModel.findByIdAndDelete(id); // Use findByIdAndDelete instead of findByIdAndRemove

        if (!deletedTodo) {
            return res.status(404).json({
                message: "Todo not found or not successfully deleted",
            });
        } else {
            return res.status(200).json({
                message: "Todo successfully deleted",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error while deleting Todo",
        });
    }
},


  // Update a specific todo
  updateTodos: async (req, res) => {
    const { id } = req.params; // Get the todo id from params
    const { title, description, deadline } = req.body;

    const updates = {
      title,
      description,
      deadline,
    };

    try {
      const updatedTodo = await TodoModel.findByIdAndUpdate(id, updates, {
        new: true, 
      });

      if (!updatedTodo) {
        return res
          .status(400)
          .json({ message: "Todo not found or update failed" });
      } else {
        return res
          .status(200)
          .json({ message: "Todo updated successfully", todo: updatedTodo });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Issues",
      });
    }
  },
};

module.exports = TodoController;
