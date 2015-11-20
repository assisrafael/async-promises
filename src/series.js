'use strict';

let eachSeries = require('./each-series.js');

function seriesArrayTasks(tasks) {
	var results = [];

	return eachSeries(tasks, (task) => {
		return Promise.resolve(task()).then((result) => {
			results.push(result);
		});
	}).then(() => {
		return results;
	});
}

function seriesObjectTasks(tasks) {
	var results = {};

	return eachSeries(Object.keys(tasks), (taskName) => {
		return Promise.resolve(tasks[taskName]()).then((result) => {
			results[taskName] = result;
		});
	}).then(() => {
		return results;
	});
}

module.exports = function parallel(tasks) {
	if (Array.isArray(tasks)) {
		return seriesArrayTasks(tasks);
	} else if (typeof tasks !== 'object') {
		return Promise.reject(new Error('Tipo de parâmetro inválido'));
	}

	return seriesObjectTasks(tasks);
};
