var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var bcrypt      = require('bcrypt-nodejs');

var UsersSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    password:  {type: String, required: false},
    passwordConf:  {type: String, required: false},
    email: {type: String, required: true, index: {unique:true}},
    googleKey: String,
    rank: {type: String, required: false},
    pantherID: {type: String, required: false},
    gender: {type: String, required: false},
    project:    String,
    piApproval: Boolean,
    isSuperUser: Boolean,
    piDenial: Boolean,
    verifiedEmail: Boolean,
    college:{type: String, required: false},
    department: String,
    major:String,
    minor:String,
    image: String,
	resume: String,
	modifying: Boolean,
    userType: {type: String},
    isDecisionMade: Boolean, // whether or not a decision has been made to approve/deny the profile
    requested_userType: {type: String, required: false},
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
	joined_project: Boolean

});

//Hash the password before the sure is saved
UsersSchema.pre('save', function(next) {
    var user = this;

    ////console.log("Called 'save' function for User");

    //Hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) {
		return next();
	}
		
		
    //Generate the hash
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err)
            return next(err);
        user.password = hash;
		user.passwordConf = hash;
        next();
    });
});
// NEED TO HASH CONFIRM PASSWORD!!!! - TMOOR
UsersSchema.methods.comparePassword = function(password) {
    var user = this;
	if (!user.password) {
		return false;
	}
    return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('Users', UsersSchema);
