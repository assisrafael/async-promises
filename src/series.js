'use strict';

let eachSeries = require('./each-series.js');

function seriesArrayTasks(tasks) {
	var results = [];

	return eachSeries(tasks, function(task) {
		return Promise.resolve(task()).then(function(result) {
			results.push(result);
		});
	}).then(function() {
		return results;
	});
}

function seriesObjectTasks(tasks) {
	var results = {};

	return eachSeries(Object.keys(tasks), function(taskName) {
		return Promise.resolve(tasks[taskName]()).then(function(result) {
			results[taskName] = result;
		});
	}).then(function() {
		return results;
	});
}

module.exports = function series(tasks) {
	if (Array.isArray(tasks)) {
		return seriesArrayTasks(tasks);
	} else if (typeof tasks === 'object') {
		return seriesObjectTasks(tasks);
	}

	return Promise.reject(new Error('Invalid parameter type'));
};
