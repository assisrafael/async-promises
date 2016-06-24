'use strict';

const range = require('./range');
const series = require('./series.js');

module.exports = function timesSeries(n, iteratee) {
	const tasks = range(0, n, 1);

	var results = [];

	return series(tasks.map((task) => () => Promise.resolve().then(() => iteratee(task))));
};
