'use strict';

let asyncEach = require('./each.js');

function parallelArrayTasks(tasks) {
	return Promise.all(tasks.map((task) => {
		return typeof task === 'function' ? task() : task;
	}));
}

function parallelObjectTasks(tasks) {
	var results = {};

	return asyncEach(Object.keys(tasks), (key) => {
		var promise = tasks[key];

		if (typeof promise === 'function') {
			promise = promise();
		}

		return Promise.resolve(promise).then((result) => {
			results[key] = result;
		});
	}).then(() => {
		return results;
	});
}

module.exports = function parallel(tasks) {
	if (Array.isArray(tasks)) {
		return parallelArrayTasks(tasks);
	} else if (typeof tasks !== 'object') {
		return Promise.reject(new Error('Tipo de parâmetro inválido'));
	}

	return parallelObjectTasks(tasks);
};
