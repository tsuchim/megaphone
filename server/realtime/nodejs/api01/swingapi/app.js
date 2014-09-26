
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
var id2cid = {}; // socket.id を cid (Client ID)に焼き直す [ id : cid ]
var swings = {}; // 各々の swing [ cid : [ mag, color ] ]
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
    // console.log('called send swind with id='+socket.id+' cid='+cid);
    //console.log(obj);
    totalSwingMagnitude += parseInt(obj.mag);
    if( ! ( cid in swings ) ) swings[cid] = {};
    // 最大100
    var mag = Math.min( obj.mag, 100 );
    swings[cid]["mag"] = mag;
    // color 
    var r = Math.round((1.5*obj.color+1)*128);
    if( 255 < r ) r = 'ff';
    else if( 15 < r ) r = r.toString(16);
    else if( 0 < r ) r = '0'+r.toString(16);
    else r = '00';
    var color = 'ff'+r+'00';

    // reserve parameters for the client
    swings[cid]["color_p"] = obj.color;
    swings[cid]["color"] = color;
    swings[cid]["lasttime"] = parseInt((new Date)/1000);

    // feedback self swing
    var obj = { total_mag: totalSwingMagnitude, self_mag: obj.mag, self_color: color };
    socket.emit('push swing', JSON.stringify(obj) );

    // console.log('swing mag='+obj.mag+' color='+color+' id='+socket.id+' cid='+cid);
  });

  // trigger by disconnection
  socket.on('disconnect', function() {
    console.log('disconnected');
  });
});

// return cid by cid
function get_cid_from_id( id ) {
    var cid=1;
    // search cid in id2cid
    if( id in id2cid ) {
	return cid = id2cid[id];
    }
    // provides new unique cid
    for( i in id2cid ) {
      if( cid<=id2cid[i] ) cid = id2cid[i]+1;
    }
    console.log('new connection cid='+cid+' for id='+id);
    return id2cid[id] = cid;
}

// execute intervally
var lastEmitMag = 0;
var lastBroadcastCount = 0;
setInterval( function () {
  // console.log('Interval totalSwingMagnitude='+totalSwingMagnitude+' lastEmitMag='+lastEmitMag);

  // Scan and validate Swing Array
  totalSwingMagnitude = 0;
  for( cid in swings ) {
      // timeout
      if( swings[cid]["lasttime"] < parseInt((new Date)/1000)-10 ) {
	  delete swings[cid];
	  console.log('delete cid='+cid);
	  continue;
      }
      // decay magnitude
      swings[cid]["mag"] *= 0.9;
      // sum for total
      totalSwingMagnitude += swings[cid]["mag"];
  }

  // broadcast
  if( 20 < lastBroadcastCount || 0.1 < totalSwingMagnitude && ( totalSwingMagnitude/lastEmitMag < 0.7 || 1.1 < totalSwingMagnitude/lastEmitMag ) ) {
    lastEmitMag = totalSwingMagnitude;
    lastBroadcastCount = 0;
    var obj = { swings: {} };
    for( cid in swings ) {
	// pack to json-source object
	obj["swings"][cid] = { "mag":swings[cid]["mag"], "color":swings[cid]["color"] };
    }
    obj['total_mag'] = totalSwingMagnitude;

    io.sockets.emit('push swings', JSON.stringify(obj) );
    console.log('emit push swings of '+Object.keys(swings).length);
    //console.log(obj);
  }else{
    lastBroadcastCount++;
  }
}, 100 );

