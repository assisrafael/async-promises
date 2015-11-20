'use strict';

module.exports = function each(arr, iterator) {
	var promises = [];

	arr.forEach((item) => {
		promises.push(iterator(item));
	});

	return Promise.all(promises);
};
