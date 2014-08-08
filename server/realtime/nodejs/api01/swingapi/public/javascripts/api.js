$(function() {
  var socket = io.connect('http://m-ph.org:3000');
  socket.on('connect', function() {
    console.log('connected');
  });

  $('#btn').click(function() {
    var message = $('#message');
    console.log(message);
    // push msg command to server
    socket.emit('send msg', message.val());
  });
  // trigger for receiving msg from server
  socket.on('push msg', function (msg) {
    console.log(msg);
    var date = new Date();
    $('#list').prepend($('<dt>' + date + '</dt><dd>' + msg + '</dd>'));
  });
  /*
  socket.on('msg updateDB', function(msg){
    console.log(msg);
  });
  */
});
