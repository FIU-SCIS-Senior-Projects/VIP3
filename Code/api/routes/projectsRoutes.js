var bodyParser = require('body-parser');
var Project = require('../models/projects');
var Term = require('../models/terms');

module.exports = function(app, express) {
    var apiRouter = express.Router();
    var currentTerm;
   
    /*
    *Temporal Seed for the terms Starts here
    */
    console.log("Seed file start");
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
                console.log("Error found ", err);
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
            console.log("Error getting the term");
            console.log(err);
        }
        currentTerm = term;
        //console.log(currentTerm);
    }); 

    //route get or adding products to a users account
    apiRouter.route('/projects')
        .post(function (req, res) {
            req.body.term = currentTerm._id;
           Project.create(req.body, function (err) {
                if(err) {
                    return res.send(err);
                }
                return res.json({success: true});
            });
        })
        .get(function (req, res) {
            Project.find({ term: currentTerm[0]._id, status: "Active" }, function (err, projects) {
                if(err) {
                    console.log(err);
                    return res.send('error');
                }
                return res.json(projects);
            });
        });

    apiRouter.route('/projects/:id')
    
    
        .put(function (req, res) {
            console.log(req.params.id);
            console.log(req.body.id);
            Project.findById(req.params.id, function(err, proj){
                console.log(proj);
                if(err) res.send(err);
                if(req.body.title!=="") proj.title = req.body.title;
                if(req.body.description!=="") proj.description = req.body.description
                if(req.body.disciplines!=="") proj.disciplines = req.body.disciplines;
                if(req.body.image!=="") proj.image = req.body.image;
                if(req.body.firstSemester!=="") proj.firstSemester = req.body.firstSemester;
                if(req.body.maxStudents!=="") proj.maxStudents = req.body.maxStudents;
                proj.save(function(err){
                    if(err) res.send(err);
                    res.json({message: 'Updated!'});
                })
            });
        })
        .get(function (req, res) {
            Project.findById({ _id:req.params.id, term: currentTerm[0]._id }, function(err, proj){
                if(err)
                    res.send(err);
                res.json(proj);
            });
        })
        .delete(function (req, res) {
            Project.remove({_id: req.params.id}, function(err, proj){
            if(err)
                res.send(err);
                res.json({message: 'successfully deleted!'});
            });
        });

    return apiRouter;
};
