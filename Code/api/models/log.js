var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var LogSchema = new Schema({
	student: {type: String, required: true},
	studentemail: {type: String, required: true}, 
    action: {type: String, required: true}, //Accept or Reject
    type: {type: String, required: true}, //Ex: Review Project Proposal or Review Student Application
    time: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Log', LogSchema);
