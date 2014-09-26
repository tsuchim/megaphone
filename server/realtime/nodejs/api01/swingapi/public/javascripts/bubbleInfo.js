function BubbleInfo(id, magnitude, color ){
    this.id = id;
    this.color = color;
    this.magnitude = magnitude;

    this.margin = Math.floor( Math.random() * 90 + 5 );

    this.size = function(){
	return 10 * Math.sqrt( this.magnitude );
    }
}

