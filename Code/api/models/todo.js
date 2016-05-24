var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var ToDoSchema = new Schema({
    todo: {type: String, required: true},
    read: {type: Boolean, default: false},
    type: {type: String, required: true},
    time: {type: Date, default: Date.now},
    link: {type: String, required: true}
});

module.exports = mongoose.model('Todo', ToDoSchema);
