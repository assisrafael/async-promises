'use strict';

module.exports = function eachSeries(arr, iterator) {
	var index = 0;

	function next() {
		if (index >= arr.length) {
			return Promise.resolve();
		}

		var item = arr[index++];

		let promise;
		try {
			promise = Promise.resolve(iterator(item))
		} catch(e) {
			return Promise.reject(e);
		}

		return promise.then(next);
	}

	return next();
};
