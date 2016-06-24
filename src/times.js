'use strict';

const range = require('./range');

module.exports = function times(n, iteratee) {
	const tasks = range(0, n, 1);

	return Promise.all(tasks.map((task) => {
		return Promise.resolve().then(() => iteratee(task));
	}));
};
