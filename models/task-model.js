const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const User = require('./user-model');

const taskSchema = new Schema({
  title: String,
  description: String,
  // subTasks: [{type: Schema.Types.ObjectId, ref: 'SubTask'}],
  zone: {
      name: String,
      address: String,
      lat: Number,
      lng: Number,
  },
  duration: Number,
  status: String,
  owner: {type: Schema.Types.ObjectId, ref: 'User', required: true}, 
  date: String,
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;