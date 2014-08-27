var bubbleManager = function( aCanvas ){

    this.bubbles = {};
    this.canvas = aCanvas;
    this.bubbleMax;
    this.seq = 1;

    this.setMax = function( aMax ){

	var less = aMax - Object.keys( this.bubbles ).length;

	if( less <= 0 ){
	    return;
	}

	if( less > 100 ){
	    less = 100;
	}

	for( var i = 0 ; i <= less ; i++ ){
	    this.addBubble();
	}
    }

    this.removeBubble = function( aId ){
	delete this.bubbles[ aId ];
    }

    this.addBubble = function(){
	var self = this;

	var aId = this.nextSequence();
	var bubble = this.bubbleElement( aId );
	this.canvas.append( bubble );
	this.bubbles[ aId ] = bubble;

	var delay = 1500 + ( Math.random() * 1000 );

	bubble.animate({
	    marginTop: '0px',
	    opacity : '0.2'
	}, delay, function(){
	    self.removeBubble( this.id );
	    this.remove();
	    self.setMax( $("#countForm").val() );
	} );

    };


    this.bubbleElement = function( aId ){
	var bubble = $("<div/>");
	bubble.addClass( "bubble" );
	bubble.html("o");
	bubble.width( "1em" );
	bubble.css("position", "absolute" );
	bubble.attr("id", aId );

	var marginLeft = Math.floor( Math.random() * 100 ); 
	bubble.css( { 'margin-left' : marginLeft +'%' } );

	return bubble;
    }

    this.nextSequence = function(){
	this.seq = this.seq + 1;
	if( this.seq > 1000000 ){
	    this.seq = 0;
	}

	return this.seq;
    }

}
