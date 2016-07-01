var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var LogSchema = new Schema({
	student: {type: String, required: true},
	firstName: {type: String, required: false},
	lastName: {type: String, required: false},
	fullName: {type: String, required: false},
	studentemail: {type: String, required: true},
	selectProject: {type: String, required: false},
	description: {type: String, required: false},
	image: {type: String, required: false},
	term: { type: String, default: 1 },
	minStudents: { type: Number, required: false},
	maxStudents: { type: Number, required: false},
    action: {type: String, required: true}, //Accept or Reject
    type: {type: String, required: true}, //Ex: Review Project Proposal or Review Student Application
    time: {type: Date, default: Date.now}
	
});

module.exports = mongoose.model('Log', LogSchema);
