'use strict';

module.exports = function eachSeries(arr, iterator) {
	var index = 0;

	function next() {
		if (index >= arr.length) {
			return Promise.resolve();
		}

		var item = arr[index++];
		return Promise.resolve(iterator(item)).then(next);
	}

	return next();
};
