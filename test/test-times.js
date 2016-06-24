'use strict';

import test from 'ava';
import * as asyncP from '../src/async-promises.js';

test('times', t => {
	var callOrder = [];
	return asyncP.times(5, i => i)
	.then((results) => {
		t.deepEqual(results, [0, 1, 2, 3, 4]);
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	});
});

test('times 3', t => {
	var args = [];
	return asyncP.times(3, (n) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				args.push(n);
				resolve();
			}, n * 25);
		});
	})
	.then((results) => {
		t.deepEqual(args, [0, 1, 2]);
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	});
});

test('times 0', t => {
	return asyncP.times(0, (n) => {
		t.fail('should not be called');
	}).then(() => {
		t.pass('should call callback');
	});
});

test('times error', t => {
	return asyncP.times(3, (n) => {
		throw 'error';
	})
	.then((results) => {
		t.fail('should not be called');
	}, (err) => {
		t.deepEqual(err, 'error');
	});
});

test('times reject', t => {
	return asyncP.times(3, (n) => {
		return Promise.reject('error');
	})
	.then((results) => {
		t.fail('should not be called');
	}, (err) => {
		t.deepEqual(err, 'error');
	});
});

