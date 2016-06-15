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

				// only update rank if user has requested it
				if (profile.requested_rank != null)
				{
					profile.rank = profile.requested_rank;
				}

				// only update usertype if user requested it
				if (profile.requested_userType != null)
				{
					profile.userType = profile.requested_userType;
				}

				// clear the requested usertypes
				profile.requested_rank = null;
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

				var isRankUpdateRequest = false;
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


				// user is privileged and should be allowed to update profile without approval
				if (profile.userType == "Staff/Faculty" || profile.userType == "Pi/CoPi")
				{
					console.log("User is privileged and allowed to update profile without approval");
					profile.rank = req.body.rank;
					profile.userType = req.body.userType
				}

				// user needs approval before updating the profile
				else
				{
					console.log("User is NOT privileged and needs approval to update the profile");
					// user is trying to change their account rank
					if (profile.rank != req.body.rank)
					{
						console.log("Users current Rank is " + profile.rank);
						console.log("User is attempting to change the rank to " + req.body.rank);

						isRankUpdateRequest = true;

						// set temporary requested_rank in database
						profile.requested_rank = req.body.rank;
					}

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
				if (isRankUpdateRequest || isUserTypeUpdateRequest)
				{
					var vm = {};
					vm.userData = {};
					vm.objectId = null;
					vm.userData.recipient = '';
					vm.userData.text = '';
					vm.userData.subject = '';

					console.log("Sending PI approval email for rank/usertype update request");

					// Here we have the user ID so we can send an email to user
					vm.objectId = profile.objectId;

					vm.userData.recipient = profile.email;
					vm.userData.text = "Dear "+ profile.firstName +",\n\nNew Profile Update Request!"+
					   " Vlad is trying to update his profile.\n\n http://localhost:3000/#/verifyprofile/" + profile._id +"";
					vm.userData.subject = "Profile Update Request!";

					var host = req.get('host');

					// build the path to the nodeemail script
					var postDomain = "http://" + host + "/vip/nodeemail2";

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
