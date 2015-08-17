/**
 * Created by Tim Zhou on 7/19/2015.
 */

var mongoose = require('mongoose');
var config =  require('./config');
var log = require('../libs/log');
db = mongoose.connect(config.dev.connectionstring);
var connection = db.connection;
connection.on('error', function (err) {
    console.error('connect to %s error: ', config.dev.connectionstring, err.message);
    process.exit(1);
});
connection.once('open', function () {
    log.success('%s has been connected.', config.dev.connectionstring);
});
module.exports = db;

//module.exports = function(config) {
//    mongoose.connect(config.connectionstring);
//    var db = mongoose.connection;
//    db.on('error', function (err) {
//        console.error('connect to %s error: ', config.connectionstring, err.message);
//        process.exit(1);
//    });
//    db.once('open', function () {
//        log.success('%s has been connected.', config.connectionstring);
//    });
//};
//var settings = require('../settings'),
//    Db = require('mongodb').Db,
//    Connection = require('mongodb').Connection,
//    Server = require('mongodb').Server;
//module.exports = new Db(settings.db, new Server(settings.host, settings.port),
//    {safe: true});
