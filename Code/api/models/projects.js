var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var ProjectSchema = new Schema({
    owner: String,
    title: String,
	owner_email: String,
	owner_rank: String,
	owner_name: String,
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
    faculty: [{name: String, email: String}],
    mentor: [{name: String, email: String}],
    members: [String],
	members_detailed: [String],
    contact: [{name: String, phone: String, email: String, office: String}],
    status: String,
	edited: Boolean,
    image: String,
    video_url: String,
    github_url: String,
    drive_url: String,
    term: { type: String, default: 1 }
});

module.exports = mongoose.model('Projects', ProjectSchema);
