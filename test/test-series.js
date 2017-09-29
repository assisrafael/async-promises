'use strict';

import test from 'ava';
import * as asyncP from '../src/async-promises.js';

test('series', t => {
	var callOrder = [];
	return asyncP.series([
		function() {
			return new Promise(function(resolve) {
				setTimeout(() => {
					callOrder.push(1);
					resolve(1);
				}, 25);
			});
		},
		function() {
			return new Promise(function(resolve) {
				setTimeout(() => {
					callOrder.push(2);
					resolve(2);
				}, 50);
			});
		},
		function() {
			return new Promise(function(resolve) {
				setTimeout(() => {
					callOrder.push(3);
					resolve([3, 3]);
				}, 15);
			});
		}
	]).then((results) => {
		t.deepEqual(callOrder, [1, 2, 3]);
		t.deepEqual(results, [1, 2, [3, 3]]);
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	});
});

test('series empty array', t => {
	return asyncP.series([])
	.then((results) => {
		t.deepEqual(results, []);
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	});
});

test('series error', t => {
	return asyncP.series([
		function() {
			return new Promise(function(resolve) {
				throw new Error('error');
			});
		},
		function() {
			t.fail(`should not be called`);
		}
	])
	.then(() => {
		t.fail('should not be called');
	}, (err) => {
		t.is(err.message, 'error');
	});
});

test('series object', t => {
	var callOrder = [];
	return asyncP.series({
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
		}
	})
	.then((results) => {
		t.deepEqual(callOrder, [1, 2, 3]);
		t.deepEqual(results, {
			one: 1,
			two: 2,
			three: [3, 3]
		});
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	});
});

test('series falsy return values', t => {
	return asyncP.series({
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

test('series should not allow values other than array and object', t => {
	return asyncP.series('should not allow and string')
		.then(() => {
			t.fail(`should not be executed`);
		}, (err) => {
			t.pass(`should not throw an error: ${err}`);
		});
});
