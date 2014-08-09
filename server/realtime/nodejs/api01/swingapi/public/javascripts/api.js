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
    $('#list').prepend($('<dt>message</dt><dd>' + msg + '</dd>'));
  });

  // send swing magnitude by hand
  $('#swing').click(function() {
    var magnitude = 50;
    // push magnitude command to server
    socket.emit('send swing', magnitude );
  });
  // trigger for receiving msg from server
  socket.on('push swing', function (mag) {
    //console.log(mag);
    $('#ss').html('<dt>盛り上がり度</dt><dd>' + mag + '</dd>');
  });

  // send swing magnitude by sensor
  window.addEventListener("devicemotion", function(e){
    var x = e.accelerationIncludingGravity.x;
    var y = e.accelerationIncludingGravity.y;
    var z = e.accelerationIncludingGravity.z;
    var mag = 10 * ( Math.sqrt(x*x + y*y + z*z) - 9.9 );
    if( 0 < mag ) socket.emit('send swing', mag );
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

