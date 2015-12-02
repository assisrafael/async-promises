'use strict';

let eachSeries = require('./each-series.js');

module.exports = function waterfall(tasks) {
	if (!Array.isArray(tasks)) {
		return Promise.reject(new Error('First argument to waterfall must be an array of functions'));
	}

	function nextItem() {
		var task = tasks.shift();

		var value = arguments[0];
		if (arguments.length > 1) {
			value = Array.prototype.slice.call(arguments);
		}

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
