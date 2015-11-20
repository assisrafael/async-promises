'use strict';

module.exports = function eachSeries(arr, iterator) {
	function next() {
		var item = arr.shift();

		if (!item) {
			return Promise.resolve();
		}

		return Promise.resolve(iterator(item)).then(next);
	}

	return next();
};
