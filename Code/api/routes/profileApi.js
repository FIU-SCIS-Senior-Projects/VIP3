var bodyParser    = require('body-parser');
var Profile        = require('../models/users');
var passport      = require('passport');
var request = require('request');

module.exports = function(app, express) {
    var apiRouter = express.Router();

	// used to update the rank/usertype of a profile that the PI has authorized the changes to
    apiRouter.route('/updateprofile')
        .put(function (req, res) {
			console.log('updateprofile has been called');
			console.log('updating the profile for user ' + req.body._id);

			Profile.findById(req.body._id, function(err, profile)
            {
				// populate all values
				profile.firstName = req.body.firstName;
				profile.lastName = req.body.lastName;
				profile.college = req.body.college;
				profile.department = req.body.department;
				profile.gender = req.body.gender;
				profile.minor = req.body.minor;
				profile.pantherID = req.body.pantherID;
				profile.major = req.body.major;
				profile.rank = req.body.rank;
				profile.userType = req.body.userType;

				console.log("rank = " + req.body.rank);
				console.log("userType = " + req.body.userType);

				// only update usertype if user requested it
				if (profile.requested_userType != null)
				{
					profile.userType = profile.requested_userType;
				}

				profile.requested_userType = null;

				// update users rank
				profile.save(function(err){
					if(err) res.send(err);
					res.json(profile);
				})

            });
        })

    apiRouter.route('/profile')
        .put(function (req, res) {
			console.log('POST /profile');
            /*
            * This update takes TOO LONG to complete therefore im using the not so short approach but the fastest of the two
            */
            // Profile.update({ _id: req.body._id }, req.body).then(function(WriteResult){
            //     console.log(WriteResult);
            //     return res.json(profile);
            // });
            // note to future devs: function finds profile via req.body._id data, and returns the found information to profile variable
            Profile.findById(req.body._id, function(err, profile)
            {

				// note to future devs: "profile.rank" is the users current rank in database, "req.body.rank" is the rank they are attempting to obtain

				var isUserTypeUpdateRequest = false;

				console.log("Profile.findById rank is " + profile.rank);

				// populate nonsensitive values
				profile.firstName = req.body.firstName;
				profile.lastName = req.body.lastName;
				profile.college = req.body.college;
				profile.department = req.body.department;
				profile.gender = req.body.gender;
				profile.minor = req.body.minor;
				profile.pantherID = req.body.pantherID;
				profile.major = req.body.major;

				// all user types are allowed to update their rankes without approval
				profile.rank = req.body.rank;


				// user is privileged and should be allowed to update profile without approval
				if (profile.userType == "Staff/Faculty" || profile.userType == "Pi/CoPi")
				{
					console.log("User is privileged and allowed to update profile without approval");
					profile.userType = req.body.userType
				}

				// user needs approval before updating the profile
				else
				{
					console.log("User is NOT privileged and needs approval to update the profile");

					// user is trying to change their account usertype
					if (profile.userType != req.body.userType)
					{
						console.log("Users current userType is " + profile.userType);
						console.log("User is attempting to change the userType to " + req.body.userType);

						isUserTypeUpdateRequest = true;

						// set temporary requested_rank userType database
						profile.requested_userType = req.body.userType;
					}
				}

				// update profile, "Rank" and "userType" changes will be handled below this, it's impossible to update those values here
				// request values will be populated in the DB here
				profile.save(function(err){
					if(err) res.send(err);
					res.json(profile);
				})

				// user wants to update "Rank" or "userType", send PI an email to accept/reject the request
				if (isUserTypeUpdateRequest)
				{
					// init
					var vm = {};
					vm.userData = {};
					var host = req.get('host');

					// build the path to the nodeemail script
					var postDomain = "http://" + host + "/vip/nodeemail2";

					// user ID in database for cross-reference
					vm.objectId = profile.objectId;

					// recipient email(s)
					vm.userData.recipient = profile.email;

					// email body text
					vm.userData.text = "Dear Pi/CoPi, \n\n" + profile.firstName + " " + profile.lastName + "is attempting to update their <font color = 'red'>userType</font> from <font color = 'red'> "
						+ profile.userType + "</font> to <font color = 'red'>" + profile.requested_userType + "</font>.\n\n Accept/Reject the changes using this URL: http://localhost:3000/#/verifyprofile/" + profile._id;

					// email subject line
					vm.userData.subject = "Profile update request from " + profile.firstName + " " + profile.lastName;

					console.log("Sending PI approval email for userType update request");

					// deploy email
					request.post(
						postDomain,
						{ form: { vm } },
						function (error, response, body) {
							if (!error && response.statusCode == 200) {
								console.log(body)
							}
						}
					);
				}
            });
        })

        .get(function (req, res) {
			console.log('POST /profile');
            Profile.find({email:req.user.email}, function (err, profile) {
                if(err) {
                    console.log(err);
                    return res.send('error');
                }
                return res.json(profile);
            });

        });


    apiRouter.route('/verifyuser/:user_id')
        .get(function (req, res) {
            Profile.findById(req.params.user_id, function(err, profile) {
                if (profile == null) {
                    res.json('Invalid link. User cannot be verified.');
                    return;
                }
                else {
                    res.json(profile);
                }
            });
        });

    return apiRouter;
};
