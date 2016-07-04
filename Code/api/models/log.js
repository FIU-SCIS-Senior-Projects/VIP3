var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var LogSchema = new Schema({
	projectid: {type: String, required: false},
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
	maxStudents: { type: Number, required: false}, //End of Rev Project Proposal fields
    gender : { type: String, required: false},	
	department : { type: String, required: false},	
	college : { type: String, required: false},	
	major : { type: String, required: false},	//End of Rev Student Application fields
	action: {type: String, required: true}, //Accept or Reject
    type: {type: String, required: true}, //Ex: Review Project Proposal or Review Student Application
    time: {type: Date, default: Date.now}
	
});

module.exports = mongoose.model('Log', LogSchema);
