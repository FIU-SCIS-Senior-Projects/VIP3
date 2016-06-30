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

				console.log("rank = " + req.body.rank);
				console.log("userType = " + req.body.userType);
                console.log("requested userType = " + profile.requested_userType);

                // we only update userType with approval
                if (req.body.isApproved)
                {
                    // only update usertype if user requested it
                    if (profile.requested_userType != null)
                    {
                        // if the user has been accepted as Pi/CoPi, make them a superuser as well
                        if (profile.requested_userType == "Pi/CoPi")
                        {
                            console.log("Set SUPERUSER");
                            profile.isSuperUser = 1;
                        }
                        
                        // set the usertype to the requested usertype
                        profile.userType = profile.requested_userType;
                    }
                }

                // remove the requested vars from db
				profile.requested_userType = null;
                profile.requested_rank = null;

				// update users rank
				profile.save(function(err){
					if(err) res.send(err);
					res.json(profile);
				})
                
                /* notify user that the profile has been accepted */
                // init
                var vm = {};
                vm.userData = {};
                var host = req.get('host');

                // build the path to the nodeemail script
                var postDomain = "http://" + "127.0.0.1:3000" + "/vip/nodeemail2";
                var reviewDomain = "http://" + host + "/#/profile";

                // recipient email(s)
                vm.userData.recipient = profile.email;

                // define the message if a user has been approved
                if (req.body.isApproved)
                {
                    console.log("profile changes have been approved");
                    // email body text
                    vm.userData.text = "Dear " + profile.firstName + " " + profile.lastName + ", \n\n"  + "Your request to update your profile has been approved. You can view your new profile information by visiting this URL: " + reviewDomain;

                    // email subject line
                    vm.userData.subject = "Profile Changes have been Approved";
                }
                
                // define the message if a user has been rejected
                else
                {
                    console.log("profile changes have been rejected");
                    
                    // email body text
                    vm.userData.text = "Dear " + profile.firstName + " " + profile.lastName + ", \n\n"  + "Unfortunantly, your request to update your profile has been rejected. You can view your current profile information by visiting this URL: " + reviewDomain;

                    // email subject line
                    vm.userData.subject = "Profile Changes have been Denied";
                }

                console.log("Sending notification of profile approval to the User");

                // deploy email
                request.post(
                    postDomain,
                    { form: { vm } },
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log(body);
                            console.log(error);
                            console.log(response);
                        }
                            console.log(body);
                            console.log(error);
                            console.log(response);
                    }
                );

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

            // find the profile via _id
            Profile.findById(req.body._id, function(err, profile){
				// note to future devs: "profile.rank" is the users current rank in database, "req.body.rank" is the rank they are attempting to obtain
                // beyond this point, the profile has been found
                
                console.log("piApproval is " + req.body.piApproval);

				var isUserTypeUpdateRequest = false;
                
                // set superuser status for a newly approved PI account
                if (!profile.isSuperUser && profile.userType == "Pi/CoPi")
                {
                    console.log("User has been approved by PI, and is a PI himself, elevate privs");
                    profile.isSuperUser = true;
                }
                
                console.log("decision made is " + req.body.isDecisionMade);
                
                // profile has been accepted or rejected, update in db
                if (!profile.isDecisionMade && req.body.isDecisionMade)
                {
                    profile.isDecisionMade = req.body.isDecisionMade;
                }

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
                
                // this field will be set to true if the acceptProfile() function called us
                if (req.body.piApproval)
                {
                    profile.piApproval = req.body.piApproval;
                }
               
				// user is privileged and should be allowed to update userType without approval
				if (profile.isSuperUser)
				{
					console.log("User is privileged and allowed to update profile without approval");
					profile.userType = req.body.userType;
				}

				// user needs approval before updating the userType
				else
				{
					console.log("User is NOT privileged and needs approval to update the userType");

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
					var postDomain = "http://" + "127.0.0.1:3000" + "/vip/nodeemail2";
                    var reviewDomain = "http://" + host + "/#/verifyprofile/" + profile._id;

					// user ID in database for cross-reference
					vm.objectId = profile.objectId;

					// recipient email(s)
					vm.userData.recipient = "vlalo001@fiu.edu,mmart196@fiu.edu,jjens011@fiu.edu,mtahe006@fiu.edu,sadjadi@cs.fiu.edu";

					// email body text
					vm.userData.text = "Dear Pi/CoPi, \n\n" + profile.firstName + " " + profile.lastName + " is attempting to update their userType FROM "
						+ profile.userType + " TO " + profile.requested_userType + ".\n\n Accept/Reject the changes using this URL: " + reviewDomain;

					// email subject line
					vm.userData.subject = "Profile update request from " + profile.firstName + " " + profile.lastName;

					console.log("Sending PI approval email for userType update request");

					// deploy email
					request.post(
						postDomain,
						{ form: { vm } },
						function (error, response, body) {
							if (!error && response.statusCode == 200) {
								console.log(body);
                                console.log(error);
                                console.log(response);
							}
                                console.log(body);
                                console.log(error);
                                console.log(response);
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


	apiRouter.route('/reviewuser/')
		.get(function (req, res) {
			console.log('POST /reviewuser');
            Profile.find({}, function (err, profile) {
				if(err) {
                    console.log(err);
                    return res.send('error');
                }
                return res.json(profile);
            });
        });

	//route for adding a member to a project(after approval)
		apiRouter.route('/reviewusers/:userid/:pid')
		.put(function (req, res) {
			console.log("PUT /reviewusers/:userid/:pid");
			console.log(req.params);
			var id = req.params.userid;
			var pid = req.params.pid;
			Profile.findOne({_id: id}, function(err, profile){
				if (err){
					res.send(err);
					 res.json({message: 'Error!'});
				}
				else if (profile){
					profile.project = pid;
					profile.save(function(err){
						if(err)  {
							res.status(400);
							res.send(err);
						}
						res.json({message: 'Project Id Added to Users Profile'});
					})

				}
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
