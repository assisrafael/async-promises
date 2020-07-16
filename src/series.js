'use strict';

const eachSeries = require('./each-series.js');

function seriesArrayTasks(tasks) {
  const results = [];

  return eachSeries(tasks, (task) =>
    Promise.resolve(task()).then((result) => {
      results.push(result);
    })
  ).then(() => results);
}

function seriesObjectTasks(tasks) {
  const results = {};

  return eachSeries(Object.keys(tasks), (taskName) =>
    Promise.resolve(tasks[taskName]()).then((result) => {
      results[taskName] = result;
    })
  ).then(() => results);
}

module.exports = function series(tasks) {
  if (Array.isArray(tasks)) {
    return seriesArrayTasks(tasks);
  }

  if (typeof tasks === 'object') {
    return seriesObjectTasks(tasks);
  }

  return Promise.reject(new Error('Invalid parameter type'));
};
