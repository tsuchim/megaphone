$(function() {
  var socket = io.connect('http://api.m-ph.org:3000');
  socket.on('connect', function() {
    console.log('connected');
  });

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

  $('#swing').click(function() {
    var magnitude = $('#magnitude');
    // push magnitude command to server
    socket.emit('send swing', magnitude.val());
  });
  // trigger for receiving msg from server
  socket.on('push swing', function (mag) {
    //console.log(mag);
    $('#ss').html('<dt>盛り上がり度</dt><dd>' + mag + '</dd>');
  });

  socket.on('msg updateDB', function(msg){
    console.log(msg);
  });

  setInterval( function() {
    socket.emit('get total swing');
  }, 1000 );
});

