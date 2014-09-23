define(['number-utils'],
function(NumberUtils) {
	return {
		Scale: function(pixelOffset, pixelRange, minValue, maxValue) {
			this.start = pixelOffset;
			this.middle = pixelOffset + pixelRange / 2;
			this.end = pixelOffset + pixelRange;
			if (minValue == maxValue) {
				throw "Min value and max are the same";
			}
			var backwards = (minValue > maxValue) ? true : false;
			this.getPixel = function(point, allowOutOfRangeValues) {
				
				if (typeof allowOutOfRangeValues === 'undefined') {
					allowOutOfRangeValues = true;
				} else {
					allowOutOfRangeValues = false;
				}

				if (
					(point < minValue || point > maxValue) &&
					allowOutOfRangeValues === false
				) {
					if (! (backwards && point <= minValue && point >= maxValue)) {
						throw "Out of range";
					}
				}
				var proportion = (point - minValue) / (maxValue - minValue);
				return pixelOffset + pixelRange * proportion;
			};
		},
		
    /**
     * Generates and returns an array of tick values
     * Taken from Graphic Gems 1 - Nice Numbers for Graph Labels
     * @link: http://inis.jinr.ru/sl/vol1/CMC/Graphics_Gems_1,ed_A.Glassner.pdf
     * @link: https://github.com/erich666/GraphicsGems/blob/master/gems/Label.c
     * 
     * @param  {Number} minValue          
     * @param  {Number} maxValue          
     * @param  {Number} targetMarkerCount 
     * @return {Array}                   
     */
    getTickMarks: function(minValue, maxValue, targetMarkerCount) {
      
      var decimalPlaces = 0;
      var tickSpacing = 0;
      var graphMin = 0;
      var graphMax = 0;
      var range = 0;
      var value = 0;
      var values = [];
      
      range = getNiceNumber( maxValue - minValue, false );
      tickSpacing = getNiceNumber( range / ( targetMarkerCount - 1 ), true );
      graphmin = Math.floor( minValue / tickSpacing ) * tickSpacing;
      graphmax = Math.ceil( maxValue / tickSpacing ) * tickSpacing;
      decimalPlaces = Math.max( -Math.floor( log10( tickSpacing ) ), 1 );
      
      for( value = graphmin; value < graphmax + 0.5 * tickSpacing; value += tickSpacing ){
        values.push( parseFloat( value.toFixed(decimalPlaces) ) );
      }

      return values;
      

      /**
       * Returns the base 10 logarithm of a number
       * @param  {Number} value 
       * @return {Number}
       */
      function log10( value ){
        return Math.log( value ) / Math.LN10;
      }


      /**
       * Returns a nice looking number
       * @param  {Number} value
       * @param  {Boolean} roundNumber
       * @return {Number}
       */
      function getNiceNumber( value, roundNumber ){

        var exponentValue = 0;
        var fractionalValue = 0;
        var niceRoundFraction = 0;

        exponentValue = Math.floor( log10( value ) );
        fractionalValue = value / Math.pow( 10, exponentValue );

        if( roundNumber ){
          if( fractionalValue < 1.5 ){
            niceRoundFraction = 1;
          } else if( fractionalValue < 3 ){
            niceRoundFraction = 2;
          } else if( fractionalValue < 7 ){
            niceRoundFraction = 5;
          } else {
            niceRoundFraction = 10;
          }
        } else {
          if( fractionalValue <= 1 ){
            niceRoundFraction = 1;
          } else if( fractionalValue <= 2 ){
            niceRoundFraction = 2;
          } else if( fractionalValue <= 5 ){
            niceRoundFraction = 5;
          } else {
            niceRoundFraction = 10;
          }
        }

        return niceRoundFraction * Math.pow( 10, exponentValue );

      }

	}
});
