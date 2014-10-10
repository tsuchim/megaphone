GestureManager = function( dom ){
    var currentDirection;
    var mc = new Hammer( dom );

    var gestured = function( ev ){
	if( ev.type != currentDirection ){
	    $("#swing").click();
	    currentDirection = ev.type;
	}
    }
    // スライドでボタンクリックと同じ動作をさせる
    mc.on("panleft panright", function(ev){ gestured(ev); });

    // ダブルタップでの拡大を阻止
    mc.on('touchend', function(ev){
      ev.preventDefault();
    }).on('doubletap', function(ev){
    });
}
