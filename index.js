const express = require("express");
const app = express();
const authRoutes = require('./src/routes/authRoutes');
const todoRoutes = require('./src/routes/todoRoutes');
const { default: mongoose } = require("mongoose");
const cors = require('cors');

require("dotenv").config();
app.use(express.json());

if (!process.env.MONGO_URI || !process.env.PORT) {
    console.error("Required environment variables are missing!");
    process.exit(1); // Exit the process with failure
    
}

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:8080'  
}));

app.use('/api/auth', authRoutes);  // Auth routes
app.use('/api/todos', todoRoutes); // Todo routes

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
