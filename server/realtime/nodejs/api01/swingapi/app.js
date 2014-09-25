
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


// ================================================================
/**
 * Module independencies.
 */

// event loop
var io = require('socket.io').listen(app);
io.set('log level', 2);
// common environment
var totalSwingMagnitude = 0;
var id2cid = []; // socket.id を cid (Client ID)に焼き直す [ id : cid ]
var swings = []; // 各々の swing [ cid : [ mag, color ] ]
// connection loop
io.sockets.on('connection', function (socket) {

  // trigger by API commands
  socket.on('send msg', function (msg) {
    // echo back 
    socket.emit('push msg', msg);
    // broadcast
    socket.broadcast.emit('push msg', msg);
  });
  socket.on('send swing', function (json) {
    var cid = get_cid_from_id( socket.id );
    var obj = JSON.parse(json);
    totalSwingMagnitude += parseInt(mag);
    swings[cid][mag]   = obj.mag;
    swings[cid][color] = obj.color;
  });

  // trigger by disconnection
  socket.on('disconnect', function() {
    console.log('disconnected');
  });
});

// return cid by cid
function get_cid_from_id( id ) {
    var cid=0;
    // search cid in id2cid
    if( id in id2cid ) {
	cid = id2dcid[id];
	return cid;
    }
    // provides new unique cid
    while(1) {
	cid = id; // とりあえずIDをそのまま使う
	if( 0 <= cid.indexOf(cid) ) continue;
	id2cid[id] = cid;
	return cid;
    }
}

// execute intervally
var lastEmitMag = 0;
setInterval( function () {
  var val = Math.round(Math.sqrt(totalSwingMagnitude));
  if( val/lastEmitMag < 0.7 || 1.1 < val/lastEmitMag ) {
    io.sockets.emit('push swing', val );
    lastEmitMag = totalSwingMagnitude;
  }
  totalSwingMagnitude *= 0.9;
}, 100 );
