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
			this.getPixel = function(point) {
				if (point < minValue || point > maxValue) {
					if (! (backwards && point <= minValue && point >= maxValue)) {
						throw "Out of range";
					}
				}
				var proportion = (point - minValue) / (maxValue - minValue);
				return pixelOffset + pixelRange * proportion;
			};
		},
		getTickMarks: function(minValue, maxValue, targetMarkerCount) {
			var values = [];

			var range = Math.abs(maxValue - minValue);
			var orderlessTarget = (range >= 1 && range <= 30) ? 1 : 5;
			var degrees = range < 1000 ? 1 : 2;

			if (! stepSize) {
				var stepSize = NumberUtils.roundToOrder(
					range / targetMarkerCount,
					orderlessTarget,
					degrees
				);
			}

			if (minValue < 0) {
				for (var value = 0; value < maxValue + stepSize; value += stepSize) {
					var newValue = value;
					values.push(newValue);
				}
				for (var value = -stepSize; value > minValue - stepSize; value -= stepSize) {
					var newValue = value;
					values.splice(0, 0, newValue);
				}
			} else {
				for (var value = minValue; value < maxValue + stepSize; value += stepSize) {
					var newValue = value;
					values.push(newValue);
				}
			}
			return values;
		}
	}
});
