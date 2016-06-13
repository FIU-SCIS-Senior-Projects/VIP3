var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var ToDoSchema = new Schema({
	owner: {type: String, required: true},
	owner_id: {type: String, required: false},
    todo: {type: String, required: true},
    read: {type: Boolean, default: false},
    type: {type: String, required: true},
    time: {type: Date, default: Date.now},
    link: {type: String, required: true}
});

module.exports = mongoose.model('Todo', ToDoSchema);
