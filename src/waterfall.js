'use strict';

let eachSeries = require('./each-series.js');

module.exports = function waterfall(tasks) {
	if (!Array.isArray(tasks)) {
		return Promise.reject(new Error('First argument to waterfall must be an array of functions'));
	}

	function nextItem(value) {
		var task = tasks.shift();

		if (!task) {
			return Promise.resolve(value);
		}

		return Promise.resolve(value).then(function(values) {
			if (Array.isArray(values)) {
				return task.apply(null, values);
			}

			return task(values);
		}).then(nextItem);
	}

	return nextItem();
};
