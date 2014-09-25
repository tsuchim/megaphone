$(function() {
  var socket = io.connect('http://api.m-ph.org:3000');
  socket.on('connect', function() {
    console.log('connected');
  });

  // send a chat message
  $('#btn').click(function() {
    var message = $('#message');
    // console.log(message);
    // push msg command to server
    socket.emit('send msg', message.val());
  });
  // trigger for receiving msg from server
  socket.on('push msg', function (msg) {
    //console.log(msg);
    $('#msglist').prepend($('<div>' + msg + '</div>'));
  });

  // send swing magnitude by hand
  $('#swing').click(function() {
    var magnitude = 50;
    // push magnitude command to server
    var obj = { mag: magnitude, color: 'F80' }
    socket.emit('send swing2', JSON.stringify(obj) );
    draw_meter('swing0',magnitude );
  });
  // trigger for receiving msg from server
  socket.on('push swing2', function (json) {
    var obj = JSON.parse(json);
    draw_meter('swing1',obj.total_mag);
  });

  function draw_meter( id, mag ) {
    $('#'+id+'_number').html(Math.round(mag));
    var sp = Math.sqrt(parseFloat(mag))/100;
    if( 1 < sp ) sp = 1;
    if( 0 > sp ) sp = 0;
    var wd = parseInt( $('#'+id+'_wrapper').width()*sp );
    $('#'+id+'_meter').css('width',wd+'px');
  }
  // send swing magnitude by sensor
  window.addEventListener("devicemotion", function(e){
    var x = e.accelerationIncludingGravity.x;
    var y = e.accelerationIncludingGravity.y;
    var z = e.accelerationIncludingGravity.z;
    var mag = 10 * ( Math.sqrt(x*x + y*y + z*z) - 10 );
    if( 0 < mag ) {
	var obj = { mag: mag, color: 'F80' }
	socket.emit('send swing2', JSON.stringify(obj) );
	draw_meter('swing0',mag);
    }
  }, true);

  /*
  socket.on('msg updateDB', function(msg){
    console.log(msg);
  });
  setInterval( function() {
    socket.emit('get total swing');
  }, 1000 );
  */
});

