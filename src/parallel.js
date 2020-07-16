'use strict';

const asyncEach = require('./each.js');

function parallelArrayTasks(tasks) {
  return Promise.all(tasks.map((task) => (typeof task === 'function' ? task() : task)));
}

function parallelObjectTasks(tasks) {
  const results = {};

  return asyncEach(Object.keys(tasks), (key) => {
    let promise = tasks[key];

    if (typeof promise === 'function') {
      promise = promise();
    }

    return Promise.resolve(promise).then((result) => {
      results[key] = result;
    });
  }).then(() => results);
}

module.exports = function parallel(tasks) {
  if (Array.isArray(tasks)) {
    return parallelArrayTasks(tasks);
  }

  if (typeof tasks === 'object') {
    return parallelObjectTasks(tasks);
  }

  return Promise.reject(new Error('First argument to parallel must be an array or an object'));
};
