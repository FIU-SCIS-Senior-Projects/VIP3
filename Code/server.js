//base setup
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

config.port = 3000;
config.database = 'admin:manager@localhost:27017/admin';

//connect to mongodb
mongoose.connect(config.database);
mongoose.connection.on('error', function(err){
	console.log('Error: could not connect to MongoDB.');
});

require('./api/config/passport')(passport);
app.use(bodyParser.json());
app.use(cookieParser());
//app.use(bodyParser());
app.use(bodyParser.urlencoded({extended:true}));

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

app.use(session(({ secret: 'ThisIsMyDirtyLittleSecretChocolatebunniesson'})));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/webapp'));

var userRoutes = require('./api/routes/userRoutes')(app, express);
var projectRoutes = require('./api/routes/projectsRoutes')(app,express);
var toDoRoutes = require('./api/routes/toDoRoutes')(app,express);
var profileRoutes = require('./api/routes/profileApi')(app,express);
var supportRoutes = require('./api/routes/support')(app,express);

app.use('/api', projectRoutes);
app.use('/vip', userRoutes);
app.use('/api', profileRoutes);
app.use('/todo', toDoRoutes);
app.use('/support', supportRoutes);


//home page
app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname + '/webapp/index.html'));
});

//start the server
app.listen(config.port);
console.log('Express router listening on port: ' + config.port);
