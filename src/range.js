'use strict';

module.exports = function range(start, end, step) {
  let index = -1,
    length = Math.max(Math.ceil((end - start) / (step || 1)), 0);

  const result = Array(length);

  while (length > 0) {
    index += 1;
    result[index] = start;
    start += step;
    length -= 1;
  }

  return result;
};
