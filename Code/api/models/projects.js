var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var ProjectSchema = new Schema({
    owner: String,
    title: String,
    description: String,
    disciplines: [String],
    firstSemester: Number,
    maxStudents: Number,
    goals: String,
    keyElements: String,
    researchIssues: String,
    meetingTime: Date,
    advisors: [{name: String, school: String}],
    sponsors: [{name: String, detail: String}],
    majPrepInt: [String],
    members: [String],
    contact: [{name: String, phone: String, email: String, office: String}],
    status: String,
    image: String,
    term: { type: String, default: 1 }
});

module.exports = mongoose.model('Projects', ProjectSchema);
