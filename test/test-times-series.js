'use strict';

import test from 'ava';
import * as asyncP from '../src/async-promises.js';

test('timesSeries', t => {
	var call_order = [];
	return asyncP.timesSeries(5, (n) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				call_order.push(n);
				resolve(n);
			}, 100 - n * 10);
		});
	})
	.then((results) => {
		t.deepEqual(call_order, [0, 1, 2, 3, 4]);
		t.deepEqual(results, [0, 1, 2, 3, 4]);
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	});
});

test('times error', t => {
	return asyncP.times(5, (n) => {
		throw 'error';
	})
	.then((results) => {
		t.fail('should not be called');
	}, (err) => {
		t.deepEqual(err, 'error');
	});
});

test('times reject', t => {
	return asyncP.times(5, (n) => {
		return Promise.reject('error');
	})
	.then((results) => {
		t.fail('should not be called');
	}, (err) => {
		t.deepEqual(err, 'error');
	});
});