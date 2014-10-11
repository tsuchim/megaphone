
// var socket = io.connect('http://api.m-ph.org:3000');
$(function() {
  document.socket.on('connect', function() {
    console.log('connected');
  });

  // send a chat message
  $('#btn').click(function() {
    var message = $('#message');
    // console.log(message);
    // push msg command to server
    document.socket.emit('send msg', message.val());
    // unforcus from chat input
    $("#message").val("").blur();
    // hide chat form
    $('div#chat_form').slideToggle('fast');

    return false;
  });
  // trigger for receiving msg from server
  document.socket.on('push msg', function (msg) {
    console.log(msg);
    $('#msglist').prepend($('<div>' + msg.encodeHTML() + '</div>'));
      if( ( $("#msglist").height() ) > $(window).height() ){
	  $('#msglist').children("div").last().remove();
      }

  });

  // send swing magnitude by hand
  $('#swing').click(function() {
    var magnitude = Math.round(Math.random()*10+10);
    // push magnitude command to server
    var obj = { mag: magnitude, color: 0 }
    document.socket.emit('send swing', JSON.stringify(obj) );
    // draw_meter('swing0',magnitude, 'FF8800' );
  });

/*
  // trigger for receiving swings from server
  document.socket.on('push swings', function (json) {
      var obj = JSON.parse(json);
//    draw_meter('swing1',obj.total_mag);
      console.log( document.bubbleManager );
  });
*/

  document.socket.on('push swing', function (json) {
    // console.log(' push swing = '+json);
    var obj = JSON.parse(json);
    draw_meter('swing0',obj.self_mag,obj.self_color);
    draw_meter('swing1',obj.total_mag);
    $('#swing0_ground_number').html(Math.round(obj.self_grand_mag));
  });

  // draw meter and digit
  window.draw_meter = function( id, mag, color ) {
    var id0_mag_max = 0;
    if( id==0 ) {
      if( id0_mag_max < mag ) {
        id0_mag_max = mag;
      }else{
        mag = id0_mag_max;
      }
    }
    $('#'+id+'_number').html(Math.round(mag));
    var sp = Math.sqrt(parseFloat(mag))/100;
    if( 1 < sp ) sp = 1;
    if( 0 > sp ) sp = 0;
    var wd = parseInt( $('#'+id+'_wrapper').width()*sp );
    if( 0 <= wd ) $('#'+id+'_meter').css('width',wd+'px');
    if( color ) $('#'+id+'_meter').css('background-color','#'+color);
  }

  // send swing magnitude by sensor
  window.addEventListener("devicemotion", function(e){
    var x = e.accelerationIncludingGravity.x;
    var y = e.accelerationIncludingGravity.y;
    var z = e.accelerationIncludingGravity.z;
    var m = Math.sqrt(x*x + y*y + z*z);
    var mag = 10 * ( m - 10 );
    if( 0 < mag ) {
	var c = -y/m;
	var obj = { mag: mag, color: c } // mag:magnitude(0-99), color:color parameter(-1 to 1)
	document.socket.emit('send swing', JSON.stringify(obj) );
	// draw_meter('swing0',mag);
    }
  }, true);

  /*
  document.socket.on('msg updateDB', function(msg){
    console.log(msg);
  });
  setInterval( function() {
    document.socket.emit('get total swing');
  }, 1000 );
  */
});

if (!String.prototype.encodeHTML) {
    String.prototype.encodeHTML = function () {
	return this.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
  };
}
if (!String.prototype.decodeHTML) {
    String.prototype.decodeHTML = function () {
	return this.replace(/&apos;/g, "'")
	.replace(/&quot;/g, '"')
	.replace(/&gt;/g, '>')
	.replace(/&lt;/g, '<')
	.replace(/&amp;/g, '&');
    };
}
