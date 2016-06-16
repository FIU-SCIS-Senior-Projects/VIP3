var bodyParser    = require('body-parser');
var Profile        = require('../models/users');
var passport      = require('passport');

module.exports = function(app, express) {
    var apiRouter = express.Router();
        
		
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
            Profile.findById(req.body._id, function(err, profile){
                profile.firstName = req.body.firstName;
                profile.lastName = req.body.lastName;
                profile.rank       = req.body.rank;    // set the users Rank within the program
                profile.college      = req.body.college;   // sets the users college
                profile.department      = req.body.department;   // sets the users college
                profile.userType = req.body.userType;
                profile.gender = req.body.gender;
                profile.minor = req.body.minor;
                profile.pantherID        = req.body.pantherID;
                profile.major        = req.body.major;
				profile.piApproval = req.body.piApproval;
				profile.project = req.body.project;
                //Missing fields go here
                
                profile.save(function(err){
                    if(err) res.send(err);
                    res.json(profile);
                })

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
