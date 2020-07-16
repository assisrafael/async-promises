'use strict';

module.exports = function eachSeries(arr, iterator) {
  let index = 0;

  function next() {
    if (index >= arr.length) {
      return Promise.resolve();
    }

    const item = arr[index];

    index += 1;

    let promise;

    try {
      promise = Promise.resolve(iterator(item));
    } catch (e) {
      return Promise.reject(e);
    }

    return promise.then(next);
  }

  return next();
};
