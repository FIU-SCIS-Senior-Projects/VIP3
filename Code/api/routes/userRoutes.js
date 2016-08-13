//Includes
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser    = require('body-parser');
var nodemailer      = require('nodemailer');

//Models
var User          = require('../models/users');

module.exports = function (app, express) {
	
	var host = app.get('host');

    //Google+ Authentication
    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

    app.get('/auth/google/callback',
        passport.authenticate('google',
        {
            successRedirect: 'http://' + host + '/#/',
            failureRedirect: '/status'
        })
    );

	app.get('/status', function(req,res) {
		var error = req.flash('error');
		if (error == 'Incorrect username/password.') {
			res.redirect('/#/login/error');
		}
		else if (error == 'Account must be verified') {
			res.redirect('/#/login/error_email');
		}
		else if (error == 'Must be FIU.EDU for Gmail login.') {
			res.redirect('/#/login/error_non');
		}
		else {
			res.redirect('/#/login/error_pi');
		}
		
	});

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
    });

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/#/proxy',
            failureRedirect: '/status',
            failureFlash: true })
    );

    // FOR LOGOUT IMPLEMENTATION
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    var userRouter = express.Router();



    // for email verification
    userRouter.route('/verifyEmail/:user_id')

        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if( user == null)
                {
                    res.json('Invalid link. Email cannot be verified.');
                    return;
                }

                user.verifiedEmail = true; // set the email verified attribute in the model to true
                // save the user
                user.save(function(err) {
                    if (err) res.send(err);
                    else {
                        res.redirect("/#emailVerified");
                    }

                   // res.json({message: 'Error, this user is not a pending student, faculty, staff or PI'})
                });
            });
        })

    userRouter.route('/nodeemail2').post(function(req, res)
    {
            var recipient = req.body.vm.userData.recipient;
            var text = req.body.vm.userData.text;
            var subject = req.body.vm.userData.subject;

            var transporter = nodemailer.createTransport({
                service:'Gmail',
                auth: {
                    user: 'fiuvipmailer@gmail.com',
                    pass: 'vipadmin123'
                }
            });

            var mailOptions = {
                from: 'FIU VIP <vipadmin@fiu.edu>', // sender address
                to: recipient, // list of receivers
                subject: subject, // Subject line
                text: text
            };

            //////console.log(mailOptions);

            // send mail with defined transport object
			transporter.sendMail(mailOptions, function(error, info)
			{
				if(error) {
					return //////console.log(error);
				}
            });
	})

    userRouter.route('/nodeemail').post(function(req, res)
	{
			//////console.log("NodeEmailer Called. We should be sending 2 emails");

            var recipient = req.body.recipient;
            var text = req.body.text;
            var subject = req.body.subject;
            var bccget = req.body.bcc;

            var recipient2 = req.body.recipient2;
            var text2 = req.body.text2;
            var subject2 = req.body.subject2;

            var transporter = nodemailer.createTransport({
                service:'Gmail',
                auth: {
                    user: 'fiuvipmailer@gmail.com',
                    pass: 'vipadmin123'
                }
            });


            var mailOptions = {
                from: 'FIU VIP <vipadmin@fiu.edu>', // sender address
                to: recipient, // list of receivers
                bcc: [bccget],
                subject: subject, // Subject line
                text: text
            };

            //////console.log(mailOptions);

            // send mail with defined transport object
			transporter.sendMail(mailOptions, function(error, info)
			{
				if(error) {
					return //////console.log(error);
				}
            });


            var mailOptions2 = {
                from: 'FIU VIP <vipadmin@fiu.edu>', // sender address
                to: recipient2, // list of receivers
                subject: subject2, // Subject line
                text: text2
            };

            //////console.log(mailOptions2);

            // send mail with defined transport object
            transporter.sendMail(mailOptions2, function(error, info){
                if(error) {
                    return //////console.log(error);
                }
            });
	})
	
	userRouter.route('/users/email/:email').get(function(req,res) {
		//////console.log("GET /users/email/:email");
		//////console.log(req.params.email);
		User.findOne({email: req.params.email}, function(err, user) {
			if (err) {
				//////console.log("Error: " + err);
			}
			else {
				if (user) {
					return res.json(user._id);
				}
			}
		});
	});
	
	userRouter.route('/users/:id').delete(function (req, res) {
			//////console.log("DELETE /users/:id");
            User.remove({_id: req.params.id}, function(err, user){
            if(err)
                return res.send(err);
                res.json({message: 'successfully deleted!'});
            });
	}).get(function(req,res) {
		//////console.log("GET /users/:id");
		//////console.log(req.params.id);
		User.findOne({_id : req.params.id}, function(err, user) {
			if (err) {
				//////console.log("Error: " + err);
			}
			else {
				if (user) {
					//////console.log(user);
					return res.json(user);
				}
			}
		});
	});

	// User.create(vm.userData).success(function(data) from userRegistrationController.js calls this function
	// BUG: This function is returning success even if the user already exists in the database
    userRouter.route('/users')

        .post(function (req, res) {

            var user = new User();

            user.firstName     = req.body.firstName;  // set the users name (comes from the request)
            user.lastName     = req.body.lastName;  // set the users last name
            user.pantherID        = req.body.pantherID;     // set the users panther ID
            user.password   = req.body.password;  // set the users password (comes from the request)
            user.passwordConf = req.body.passwordConf;
            user.email      = req.body.email;   // sets the users email
            user.project    = req.body.project; // sets the users project
            user.rank       = req.body.rank;    // set the users Rank within the program
            user.college      = req.body.college;   // sets the users college
            user.department      = req.body.department;  // sets the users college
            
            // mohsen says his and masouds accounts should automatically become verified as Pi
            if (req.body.email == "mtahe006@fiu.edu" || req.body.email == "sadjadi@cs.fiu.edu")
            {
                // give them all perms
                user.piApproval = true;
                user.piDenial = false;
                user.verifiedEmail = true;
                user.isDecisionMade = true;
                user.isSuperUser = true;
            }
            
            else
            {
                // initially has to be init to false
                user.piApproval = false;
                user.piDenial = false;
                user.verifiedEmail = false;
                user.isDecisionMade = false;
                // always set to false, until the user is approved as a PI
                user.isSuperUser = false;
            }
            
            user.googleKey = " ";
            user.userType = req.body.userType;
            user.gender = req.body.gender;

            user.save(function (err)
            {
				// an error occured while trying to insert the new user
                if (err) {
                    // duplicate entry - user exists
                    if (err.code == 11000)
                        return res.json({success: false, message: 'A user already exists.'});
                    else
                        return res.send({success: false, error: err});
                }

                // return the object id for validation and message for the client
                res.json({success: true, objectId: user._id, message: 'User account created please verify the account via the registered email.' });
            });
        }).put(function(req,res) {
			//////console.log("PUT UPDATE USER");
			User.findOne({'email': req.body.user.email}, function(err, user) {
				if (user) {
					 user.firstName     = req.body.user.firstName;  // set the users name (comes from the request)
					 user.lastName     = req.body.user.lastName;  // set the users last name
					 user.pantherID        = req.body.user.pantherID;     // set the users panther ID
					 user.password   = req.body.user.password;  // set the users password (comes from the request)
					 user.passwordConf = req.body.user.passwordConf;
					 user.email      = req.body.user.email;   // sets the users email
					 user.project    = req.body.user.project; // sets the users project
					 user.rank       = req.body.user.rank;    // set the users Rank within the program
					 user.college      = req.body.user.college;   // sets the users college
					 user.department      = req.body.user.department;  // sets the users college
					 user.joined_project = req.body.user.joined_project;
					 //////console.log("User: " + req.body.user);
					 //////console.log("Joined project: " + user.joined_project);
					 user.save(function(err) {
							if (err) {
								//////console.log("Error updating user.");
							}
					 });
				}
			});
		});

    return userRouter;
};
