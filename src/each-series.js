'use strict';

module.exports = function eachSeries(arr, iterator) {
	var index = 0;

	function next() {
		var item = arr[index++];

		if (!item) {
			return Promise.resolve();
		}

		return Promise.resolve(iterator(item)).then(next);
	}

	return next();
};
