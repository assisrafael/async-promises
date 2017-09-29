'use strict';

import test from 'ava';
import * as asyncP from '../src/async-promises.js';

test('parallel', t => {
	var callOrder = [];
	return asyncP.parallel([
		function() {
			return new Promise(function(resolve) {
				setTimeout(() => {
					callOrder.push(1);
					resolve(1);
				}, 50);
			});
		},
		function() {
			return new Promise(function(resolve) {
				setTimeout(() => {
					callOrder.push(2);
					resolve(2);
				}, 75);
			});
		},
		function() {
			return new Promise(function(resolve) {
				setTimeout(() => {
					callOrder.push(3);
					resolve([3, 3]);
				}, 25);
			});
		},
		function() {
			return 4;
		}
	])
	.then((results) => {
		t.deepEqual(callOrder, [3, 1, 2]);
		t.deepEqual(results, [1, 2, [3, 3], 4]);
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	});
});

test('parallel empty array', t => {
	return asyncP.parallel([])
	.then((results) => {
		t.deepEqual(results, []);
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	});
});

test('parallel error', t => {
	var callOrder = [];
	return asyncP.parallel([
		function() {
			return new Promise(function(resolve) {
				throw new Error('error');
			});
		},
		function() {
			return new Promise(function(resolve) {
				setTimeout(() => {
					callOrder.push(2);
					resolve(2);
				}, 25);
			});
		},
	])
	.then(() => {
		t.fail('should not be called');
	}, (err) => {
		t.is(err.message, 'error');
	});
});

test('parallel object', t => {
	var callOrder = [];
	return asyncP.parallel({
		one() {
			return new Promise(function(resolve) {
				setTimeout(() => {
					callOrder.push(1);
					resolve(1);
				}, 50);
			});
		},
		two() {
			return new Promise(function(resolve) {
				setTimeout(() => {
					callOrder.push(2);
					resolve(2);
				}, 75);
			});
		},
		three() {
			return new Promise(function(resolve) {
				setTimeout(() => {
					callOrder.push(3);
					resolve([3, 3]);
				}, 25);
			});
		},
		four() {
			return 4;
		}
	})
	.then((results) => {
		t.deepEqual(callOrder, [3, 1, 2]);
		t.deepEqual(results, {
			one: 1,
			two: 2,
			three: [3, 3],
			four: 4
		});
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	});
});

test('parallel falsy return values', t => {
	return asyncP.parallel({
		falseValue() {
			return Promise.resolve(false);
		},
		undefinedValue() {
			return;
		},
		emptyValue() {
			return Promise.resolve();
		},
		nullValue() {
			return null;
		}
	})
	.then((results) => {
		t.is(results.falseValue, false);
		t.is(results.undefinedValue, undefined);
		t.is(results.emptyValue, undefined);
		t.is(results.nullValue, null);
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	});
});

test('parallel without array or object', t => {
	return asyncP.parallel('string not allowed')
		.then(() => {
			t.fail(`should not be executed`);
		}, (err) => {
			t.pass(`should throw an error: ${err}`);
		});
});

test('parallel with promises inside array', t => {
	return asyncP.parallel([
		Promise.resolve(1),
		function() {
			return 2;
		}
	]).then((r) => {
		t.deepEqual(r, [1, 2]);
	});
});
