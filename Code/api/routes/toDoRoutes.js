/* var ToDo	= require('../models/todo'); <--this line goes on top

    var todo = new ToDo();
    todo.todo = the title of the app;
    todo.type = type of todo, needs to be hard coded based upon tasks
        acceptable values - CASE SENSITIVE!:
             personal   ---- profile needs
             user       ---- for account registration
             project    ---- proposal review
             student    ---- for application review
    todo.link = your unique link;
    ToDo.create(todo, function(err) {
        if(err) {
            return res.send('error');
        } else {
            res.send('to do added');
        }
    });
*/

var mongoose	= require('mongoose');
var ToDo	    = require('../models/todo');

module.exports = function(app, express) {
    var apiRouter = express.Router();

    apiRouter.route('/todo')
        .get(function (req, res) {
            ToDo.find({}, function(err, todo) {
                if(err) {
                    res.send('There was an error processing the tasks');
                } else {
                    res.send(todo);
                }
            });
        })
        .post(function (req, res) {
            ToDo.create(req.body, function( err) {
                if(err) {
                    return res.send('something went wrong');
                } else {
                    res.send('to do added');
                }
            });
        });

    apiRouter.route('/todo/:id')
        .post(function (req, res) {
            ToDo.findOne({_id:req.params.id}, function(err, todo) {
                if(err) {
                    res.send('There was an error processing the tasks');
                } else {
                    todo.read = true;
                    todo.save();
                    res.send('read');
                }
            });
        });

    return apiRouter;
}
