(function ($) {
$.fn.bubbleManager = function (options) {
    var self = this;
    var bubbles = [];
    var current_disploy_number = 0;

    var addBubble = function(){

	var bubbleInfo = new BubbleInfo( $(options.idForm).val(), $(options.magForm).val(), $(options.colorForm).val() );

	var bubble = createBubble( bubbleInfo );
	self.append(bubble);
	animateBubble( bubble );
    }

    var repeatBubble = function( bubble ){
	if( isLiveBubble( bubble ) == false ){
	    bubble.remove();
	    return;
	}
	animateBubble( bubble );
    }

    var animateBubble = function( bubble ){
	bubble.css('margin-top', $(document).height() - 300);
	bubble.css('opacity', 1 );
        bubble.animate({
            marginTop: '0px',
            opacity : '0.2'
        }, 1500, function(){
	    repeatBubble( $(this) );
        });
    }

    var isLiveBubble = function( bubble ){
	return true;
    }

    var createBubble = function( info ) {
        var bubble = $("<div/>");
        bubble.addClass( "bubble" );
        bubble.html( );
        bubble.width( "1em" );
        bubble.css("position", "absolute" );
	bubble.attr("id", info.id );

	var size = info.size();;
	bubble.css( "width", size );
	bubble.css( "height", size );
	bubble.css( "-webkit-border-radius", (size/2) );
	bubble.css( "-moz-border-radius", (size/2) );
	bubble.css( "border-radius", (size/2) );

        bubble.css( { 'margin-left' : info.margin +'%' } );
        return bubble;
    };

    $(options.button).click(addBubble);


};
})(jQuery);
