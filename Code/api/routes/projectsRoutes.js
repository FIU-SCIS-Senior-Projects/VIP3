var bodyParser = require('body-parser');
var Project = require('../models/projects');
var Term = require('../models/terms');


module.exports = function(app, express) {
    var apiRouter = express.Router();
    var currentTerm;

    /*
    *Temporal Seed for the terms Starts here
    */
    ////console.log("Seed file start");
    var termsSeed = [
        {
            name: "Spring",
            start: new Date(2016, 01),
            end: new Date(2016, 05),
            deadline: new Date(2016, 01),
            active: true
        },
        {
            name: "Summer",
            start: new Date(2016, 05),
            end: new Date(2016, 08),
            deadline: new Date(2016, 05),
            active: false
        }
    ];
    Term.count(function (err, count) {

        if (!err && count === 0) {
            Term.create(termsSeed, function(err){
                ////console.log("Error found ", err);
            });
        }
    });
    /*
    *Temporal Seed for the terms Ends here
    */

    //Getting the current term
    Term.find({active: true}, function(err, term){



        if(err)
        {
            ////console.log("Error getting the term");
            ////console.log(err);
        }
        currentTerm = term;


    });
	
    //route get or adding projects to a users account
    apiRouter.route('/projects')
        .post(function (req, res) {
			
			console.log(req.body.faculty);
            req.body.term = currentTerm[0]._id;

			//Validate to ensure student counts isn't negative or student count is greater than maximum.
            
            var studentCount = 0;
			var maxStudentCount = 0;
            
            // user provided a min number of students
            if (req.body.firstSemester)
                studentCount = Number(req.body.firstSemester);
            
            // user provided a max number of students
            if (req.body.maxStudents)
                maxStudentCount = Number(req.body.maxStudents);

            //console.log(req.body.video_url);

            // user didnt supply a min and max number of students, make it a really big number so anyone can join
			if (isNaN(studentCount) || isNaN(maxStudentCount)) {
				req.body.firstSemester = "1";
				req.body.maxStudents = "256";
			}
			
            // user didnt supply a min and max number of students, make it a really big number so anyone can join
			if (studentCount == 0 && maxStudentCount == 0) {
				req.body.firstSemester = "1";
				req.body.maxStudents = "256";
			}
			
			if (studentCount < 0 || maxStudentCount < 0) {

				res.status(400);
                return res.send("firstSemester cannot be less than 0 or maxStudents cannot be less than 0.");
			}
            
			if (studentCount > maxStudentCount) {
				res.status(400);
				return res.send("Count cannot be greater than the maximum.");
			}
			
			////console.log(req.body);


           Project.create(req.body, function (err) {
                if(err) {
					res.status(400);
                    return res.send(err);
                }
                return res.json({success: true});
            });
        })
        .get(function (req, res) {

            Project.find({ term: currentTerm[0]._id }, function (err, projects) {

                if(err) {
                    ////console.log(err);
                    return res.send('error');
                }
                ////console.log("Got Current Term");
                return res.json(projects);
            });
        });

    apiRouter.route('/projects/:id')
        .put(function (req, res)
        {
			//////console.log("PUT /projects/:id");
            Project.findById(req.params.id, function(err, proj)
            {
                if(err) {
					res.status(400);
					res.send(err);
				}

                if (req.body.image)
                {
                    console.log("new image : " + req.body.image);
                    proj.image = req.body.image;
                }
                
                proj.video_url = req.body.video_url;
				proj.edited = req.body.edited;
				proj.status = req.body.status;
				proj.faculty = req.body.faculty;
				proj.mentor = req.body.mentor;
				proj.addedStudents = req.body.addedStudents;
				proj.owner_name = req.body.owner_name;
				proj.owner_email = req.body.owner_email;
				proj.old_project = req.body.old_project;
				console.log("Old Project: " + proj.old_project);
                if(req.body.title!=="") proj.title = req.body.title;
                if(req.body.description!=="") proj.description = req.body.description
                if(req.body.disciplines!=="") proj.disciplines = req.body.disciplines;
                if(req.body.firstSemester!=="") proj.firstSemester = req.body.firstSemester;
                if(req.body.maxStudents!=="") proj.maxStudents = req.body.maxStudents;
				if (req.body.members.length > proj.maxStudents) {
					res.status(400);
					return res.send("Max capacity reach no more students can join");
				}
				else {
					proj.members = req.body.members;
					
				}
				if (req.body.members_detailed.length > proj.maxStudents) {
					res.status(400);
					return res.send("Max capacity reach no more students can join");
					
				}
				else {
					proj.members_detailed = req.body.members_detailed;
					
				}
                proj.save(function(err){
                    if(err)  {
						res.status(400);
						return res.send(err);
					}
                    res.json({message: 'Updated!'});
                })
            });
        })
        .get(function (req, res) {
            Project.findById(req.params.id, function(err, proj){
                if(err)
                   return res.send(err);
                res.json(proj);
            });
        })
        .delete(function (req, res) {
            Project.remove({_id: req.params.id}, function(err, proj){
            if(err)
               return res.send(err);
                res.json({message: 'successfully deleted!'});
            });
        });

		
		//route for removing a member from a project (members in project are treated as student applications for the project)
		apiRouter.route('/project/:id/:members/:detailed')
		.put(function (req, res) {
			console.log("PUT /project/:id/:members/:detailed");
			console.log(req.params);
			var id = req.params.id;
			var memberemail = req.params.members;
			var members_detailed = req.params.detailed;
			if (memberemail != null)
			{
			Project.findOne({_id: id}, function(err, proj){
				if (err){
					return res.send(err);
					 res.json({message: 'Error!'});
				}
				else if (proj){
					console.log("Members: " + memberemail + " Detailed: " + members_detailed);
					proj.members.pull(memberemail);
					proj.members_detailed.pull(members_detailed);
					proj.save(function(err){
						if(err)  {
							res.status(400);
							return res.send(err);
						}
						res.json({message: 'Application Removed from Project'});
					})
					
				}
			});
			}
		});

		
		
		
	//route for checking pending projects
	apiRouter.route('/reviewproject')
		.get(function (req, res) {

            ////console.log("Looking for projs");
        
            Project.find({$or:[{ term: currentTerm[0]._id, status: "pending" }, { term: currentTerm[0]._id, status: "modified" }]}, function (err, projects) {

                if(err) {
                    ////console.log(err);
                    return res.send('error');
                }
                return res.json(projects);
            });
        });
	
	//route for accepting pending projects
	apiRouter.route('/reviewproject/:id')
		.put(function (req, res) {
			////console.log("PUT /reviewproject/:id "  );
			 Project.findById(req.params.id, function(err, proj){
	
				 if(err) {
						res.status(400);
						return res.send(err);
					}
					proj.status = 'Active';
					proj.old_project = undefined;
					proj.save(function(err){
						if(err)  {
							res.status(400);
							return res.send(err);
						}
						res.json({message: 'Approved!'});
					})
				});
		})
		
		.delete(function (req, res) {
            Project.remove({_id: req.params.id}, function(err, proj){
            if(err)
                return res.send(err);
                res.json({message: 'successfully deleted!'});
            });
        });
		
		
	//route for making an approved project back to a pending project
		apiRouter.route('/reviewproject/:pid/:project')
		.put(function (req, res) {
			////console.log("PUT /reviewproject/:pid/:project "  );
			 Project.findById(req.params.pid, function(err, proj){
	
				 if(err) {
						res.status(400);
						return res.send(err);
					}
					proj.status = 'pending';
					proj.save(function(err){
						if(err)  {
							res.status(400);
							return res.send(err);
						}
						res.json({message: 'Success: Active project turned into a pending project!'});
					})
				});
		})
		
    return apiRouter;
};
