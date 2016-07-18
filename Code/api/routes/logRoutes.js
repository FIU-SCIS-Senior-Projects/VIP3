var mongoose	= require('mongoose');
var Log	    = require('../models/log');

module.exports = function(app, express) {
    var apiRouter = express.Router();

    apiRouter.route('/log')
        .get(function (req, res) {
            Log.find({}, function(err, log) {
                if(err) {
                    res.send('There was an error processing');
                } else {
                    res.send(log);
                }
            });
        })
        .post(function (req, res) {
			////console.log("POST /LOG");
			////console.log(req.body);
            Log.create(req.body, function( err) {
                if(err) {
					////console.log("Error:");
					////console.log(err);
                    return res.send('something went wrong');
                } else {
                    res.send('Log added');
                }
            });
        });

    apiRouter.route('/log/:id')
        .post(function (req, res) {
            Log.findOne({_id:req.params.id}, function(err, log) {
                if(err) {
                    res.send('There was an error processing');
                } else {
                    log.read = true;
                    log.save();
                    res.send('read');
                }
            });
        })
		.delete(function (req, res) {
            Log.remove({_id: req.params.id}, function(err, log){
            if(err)
                res.send(err);
                res.json({message: 'successfully deleted!'});
            });
        });
		
	apiRouter.route('/log/:type')
        .get(function (req, res) {
            Log.find({type: req.params.type}, function(err, log) {
                if(err) {
                    res.send('There was an error processing');
                } else {
                    res.send(log);
                }
            });
        });

    return apiRouter;
}
