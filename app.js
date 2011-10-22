
/**
 * Module dependencies.
 */

var express = require('express');

var errorHandler = require('./error_handler.js');
var controller = require('./controller.js');

var mongoose = require('mongoose');
var mongoDb = require('mongodb').Db,
    mongoServer = require('mongodb').Server;
var mongoUtils = require('./mongo_utils.js');

var MONGO_HOST = 'localhost';
var MONGO_PORT = '27017';
var MONGO_DATABASE = 'node_yabe';

console.log("----------------------> Express version: " + express.version);

var app = module.exports = express.createServer();

/**
 *  This function is used to intialize the HTTP server and connect to MongoDB (Mongoose).
 */
var startServer = function() {
    app.listen(4000, function() {
        console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
        mongoose.connect('mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/' + MONGO_DATABASE);
    });
};

// Configuration
app.configure('development', function(){
  console.log("Development environment configuration...");
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  
  // Comment this line if you want to keep your data after application restart
  app.enable('testingData');
});

app.configure('pre-production', function() {
    console.log("Pro-production environment configuration...");
  app.use(express.errorHandler()); 
});

app.configure('production', function(){
    console.log("Production environment configuration...");
    app.use(express.errorHandler()); 
});

app.configure(function(){
  console.log("Default configuration...");
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.set('view options', { layout: false });
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'ur9whqkrh9p8fhdsapha9ASF222930cnns79' }));
  app.use(express.methodOverride());
  app.use(require('./lib/auth.js')(app)); // Custom auth module (needs app as paremeter)
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
    
  errorHandler.config(app); // Custom error handler configuration
  
  // This is the way we can register functions so we have them 
  // globally available in Jade templates
  app.set('view options', {
    exists: function(variable) {
        return (typeof(variable) != 'undefined');
    }
  });
});

// This is the way we can register more common local variables 
// for the template engine using request and response objects
app.dynamicHelpers({
    currentUserName: function(req, res) {
        //console.log("App:dynamicHelper# Estableciendo el nombre del usuario actual: " + req.session.currentUser);
        return (req.session && req.session.currentUser) ? req.session.currentUser.fullname : '';
    },
    currentUserRole: function(req, res) {
        return (req.session && req.session.currentUser) ? req.session.currentUser.role : '';
    }
});


// Initialize the controllers mapping
controller.init(app);


// Configure MongoDB connection
mongoUtils.configureConnection(app.enabled('testingData'));


// Let the show begins
if (app.enabled('testingData')) {
    mongoUtils.dropDatabase({
        host: MONGO_HOST,
        port: MONGO_PORT,
        database: MONGO_DATABASE
    }, startServer);
} else {
    startServer();
}


