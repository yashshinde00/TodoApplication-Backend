const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const TodoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date }, 
  createdAt: { type: Date, default: Date.now },
  done: { type: Boolean, default: false }
});



const UserModel = mongoose.model('User', UserSchema);
const TodoModel = mongoose.model('Todo', TodoSchema);

module.exports = {
  UserModel,
  TodoModel,
};
