'use strict';

module.exports = function waterfall(tasks) {
  if (!Array.isArray(tasks)) {
    return Promise.reject(new Error('First argument to waterfall must be an array of functions'));
  }

  function nextItem(value) {
    const task = tasks.shift();

    if (!task) {
      return Promise.resolve(value);
    }

    return Promise.resolve(value)
      .then((values) => {
        if (Array.isArray(values)) {
          return task.apply(null, values);
        }

        return task(values);
      })
      .then(nextItem);
  }

  return nextItem();
};
