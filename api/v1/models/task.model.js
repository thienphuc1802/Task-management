const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: String,
    status: String,
    content: String,
    deleted: Boolean,
    createdBy: String,
    listUser: Array,
    taskParentId: String,
});

const Task = mongoose.model('Task', taskSchema, 'tasks');

module.exports = Task;