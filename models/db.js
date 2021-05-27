var settings = require('../setting');
var  mongodb = require('mongodb');
var  server  = new mongodb.Server(settings.host, settings.port, {});
module.exports = new mongodb.Db(settings.db, server, {});

// var Db = require('mongodb').Db;
// var Connection = require('mongodb').Connection;
// var Server = require('mongodb').Server;
// module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT, {}));
