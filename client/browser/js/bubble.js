(function ($) {
$.fn.bubbleManager = function (options) {
    var self = this;
    var bubbles = [];
    var current_disploy_number = 0;
    var start = function () {
        createBubbles( $("#countForm").val() );
    };

    $(options.button).click(start);

    var createBubbles = function(number) {
        var remain = number - current_disploy_number;
        var n = Math.min(number,remain,options.max);
        for (var i = 0; i < n; i++) {
            var bubble = createBubble();
            current_disploy_number++;
            self.append(bubble);
            var delay = 1500 + ( Math.random() * 1000 );
            bubble.animate({
                marginTop: '0px',
                opacity : '0.2'
            }, delay, function(){
                this.remove();
                current_disploy_number--;
                start();
            });
        }
    };

    var createBubble = function() {
        var bubble = $("<div/>");
        bubble.addClass( "bubble" );
        bubble.html("o");
        bubble.width( "1em" );
        bubble.css("position", "absolute" );

        var marginLeft = Math.floor( Math.random() * 100 );
        bubble.css( { 'margin-left' : marginLeft +'%' } );
        return bubble;
    };
};
})(jQuery);
