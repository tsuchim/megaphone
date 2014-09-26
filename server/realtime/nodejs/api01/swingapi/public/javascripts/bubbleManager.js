(function ($) {
$.fn.bubbleManager = function (options) {
    var self = this;
    var bubbles = [];
    var current_disploy_number = 0;

    
    var isUsedId = function( id ){
	if( bubbles[ id ] ){
	    return true;
	}
	return false;
    }

    $.fn.bubbleManager.addBubble = function( id, mag, color){
	if( isUsedId( id ) == true ){
	    bubbles[ id ] = new BubbleInfo( id, mag, color );;
	    return;
	}

	bubbles[ id ] = new BubbleInfo( id, mag, color );;
	var bubble = createBubble( bubbles[ id ] );
	self.append(bubble);
	animateBubble( bubble );
    }

    $.fn.bubbleManager.removeBubble = function( id ){
	delete( bubbles[id] );
    }

    $.fn.bubbleManager.ids = function( id ){
	var ids = [];
	for( i in bubbles ){
	    ids[i] = 1;
	}
	return ids;
    }

    var repeatBubble = function( bubble ){
	if( isLiveBubble( bubble ) == false ){
	    bubble.remove();
	    return;
	}
	animateBubble( bubble );
    }

    var animateBubble = function( bubble ){
	var id = bubble.attr("id");

	var info = bubbles[ id ];

	var size = info.size();;
	bubble.css( "width", size );
	bubble.css( "height", size );
	bubble.css( "-webkit-border-radius", (size/2) );
	bubble.css( "-moz-border-radius", (size/2) );
	bubble.css( "border-radius", (size/2) );
	bubble.css( "background-color", info.color );

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
	var id = bubble.attr("id");
	if( bubbles[ id ] ){
	    return true;
	}
	return false;
    }

    var createBubble = function( info ) {
        var bubble = $("<div/>");
        bubble.addClass( "bubble" );
        bubble.html( );
        bubble.width( "1em" );
        bubble.css("position", "absolute" );
	bubble.attr("id", info.id );

        bubble.css( { 'margin-left' : info.margin +'%' } );
        return bubble;
    };


};
})(jQuery);
