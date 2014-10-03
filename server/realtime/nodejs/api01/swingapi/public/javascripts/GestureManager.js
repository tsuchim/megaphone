GestureManager = function( dom ){
    var currentDirection;
    var mc = new Hammer( dom );

    var gestured = function( ev ){
	if( ev.type != currentDirection ){
	    $("#swing").click();
	    currentDirection = ev.type;
	}
    }

    mc.on("panleft panright", function(ev){ gestured(ev); });

}
