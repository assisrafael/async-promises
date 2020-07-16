'use strict';

module.exports = function each(arr, iterator) {
  const promises = [];

  arr.forEach((item) => {
    promises.push(iterator(item));
  });

  return Promise.all(promises);
};
