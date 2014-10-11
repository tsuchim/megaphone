(function ($) {
$.fn.chatManager = function(options) {
    var self = this;

    var sendMessage = function( message ){
	document.socket.emit('send msg', message );
	$('div#chat_form').slideToggle('fast');
    }

    var stampButton = function( event ){
	var button = $(event.target);
	sendMessage( button.val() );
    }

    var createButtons = function(){
	for( i in options.labels ){
	    var label = options.labels[i];
	    var button =  $("<input />").attr("type", "button").attr("value", label).addClass("button");  
	    button.bind("click", label, stampButton );
	    $( options.box ).append(button);  
	}
    }

    createButtons();

};
})(jQuery);
