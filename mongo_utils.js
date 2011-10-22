var mongoose = require('mongoose');
var Db = require('mongodb').Db,
    Server = require('mongodb').Server;
var sys = require('sys');

/**
 *  Configures the listeners when connecting to MongoDB. 
 */
var configureConnection = function(isTestingEnvironment) {

    /**
     * Function to be executed when connected to MongoDB.
     */
    mongoose.connection.on('open', function() {
        console.log('Express application connected to MongoDB.');
        if (isTestingEnvironment) {
          console.log("Recreating test data...");
          var initialData = require('./initial-data.js');
          var instances = initialData.users.concat(initialData.posts);
          var index = 0, len = instances.length;
          
          for (index = 0; index < len; index++) {
            instances[index].save(function(err) {
                if (err) {
                    console.log('ERROR: It was no possible to save sample data: ' + err);
                } 
            });
          }    
      }
    });
    
    /**
     * Function to be executed when connection to MongoDB fails.
     */
    mongoose.connection.on('error', function(err) {
        console.log('ERROR trying to connect to MongoDB from Express application.');
        console.log(err);
    });

};

/**
 * Function to remove application database.
 */
var dropDatabase = function(mongoConfig, callback) {
    var db = new Db(mongoConfig.database, new Server(mongoConfig.host, mongoConfig.port, {}), {native_parser:false});
    db.open(function(err, dbb) {    
        if (err) {
            console.log("Error conectandose a Mongo: " + sys.inspect(err));
        } else {
            console.log("Dropping database...");
            dbb.dropDatabase(function(err) {
                if (err) {
                    console.log("Error trying to drop development database: " + err);
                } else {
                    console.log("Development database dropped.");
                    dbb.close(function(err) {
                        if (err) {
                            console.log("ERROR trying to disconnect from MongoDB after dropping development database: " + err);
                        } else {
                            callback.apply();
                        }
                    });
                }
            });        
        }
    });
};

exports.configureConnection = configureConnection;
exports.dropDatabase = dropDatabase;