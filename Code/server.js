//base setup michael
var express		= require('express');
var nodemailer = require('nodemailer');

var mongoose	        = require('mongoose');
var passport			= require('passport');
var cookieParser		= require('cookie-parser');
var flash				= require('connect-flash');
var session             = require('express-session');
var bodyParser	        = require('body-parser');
var path		= require('path');
var config		= require('./api/config/config');
var app			= express();


//Set HOST 
app.set("host", "vip.fiu.edu");

//connect to mongodb
mongoose.connect(config.database);
mongoose.connection.on('error', function(err){
	//console.log('Error: could not connect to MongoDB.');
});

require('./api/config/passport')(passport,app);
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(cookieParser());

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
	next();
});

app.use(session(({ secret: 'ThisIsMyDirtyLittleSecretChocolatebunniesson'})));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/webapp'));
app.set('root',__dirname + '/webapp');

var userRoutes = require('./api/routes/userRoutes')(app, express);
var projectRoutes = require('./api/routes/projectsRoutes')(app,express);
var toDoRoutes = require('./api/routes/toDoRoutes')(app,express);
var profileRoutes = require('./api/routes/profileApi')(app,express);
var supportRoutes = require('./api/routes/support')(app,express);
var logRoutes = require('./api/routes/logRoutes')(app,express);


app.use('/api', projectRoutes);
app.use('/vip', userRoutes);
app.use('/api', profileRoutes);
app.use('/todo', toDoRoutes);
app.use('/support', supportRoutes);
app.use('/log', logRoutes);





//home page
app.get('*', function (req, res) {
	//console.log(req.user);
	res.sendFile(path.join(__dirname + '/webapp/index.html'));
});

//start the server
app.listen(config.port);
//console.log('Express router listening on port: ' + config.port);
