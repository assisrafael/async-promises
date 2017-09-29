'use strict';

import test from 'ava';
import * as asyncP from '../src/async-promises.js';

test('eachSeries', t => {
	var args = [];
	var arr = [1, 2, 3];
	return asyncP.eachSeries(arr, (x) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				args.push(x);
				resolve();
			}, 25);
		});
	})
	.then(() => {
		t.deepEqual(args, arr);
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	});
});

test('eachSeries empty array', t => {
	return asyncP.eachSeries([], (x) => {
		t.fail('iterator should not be called');
	})
	.then(() => {
		t.pass('should return a promise or a thenable');
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	});
});

test('eachSeries empty array, with other property on the array', t => {
	var myArray = [];
	myArray.myProp = 'anything';
	return asyncP.eachSeries(myArray, (x) => {
		t.fail('iterator should not be called');
	})
	.then(() => {
		t.pass('should return a promise or a thenable');
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	});
});

test('eachSeries reject error', t => {
	return asyncP.eachSeries([1, 2, 3], (x) => {
		return Promise.reject('error');
	})
	.then(() => {
		t.fail('should not be called');
	}, (err) => {
		t.deepEqual(err, 'error');
	});
});

test('eachSeries throw error', t => {
	return asyncP.eachSeries([1, 2, 3], (x) => {
		throw 'error';
	})
	.then(() => {
		t.fail('should not be called');
	}, (err) => {
		t.deepEqual(err, 'error');
	});
});

test('eachSeries with null element', t => {
	t.plan(2);
	return asyncP.eachSeries([null], (x) => {
		t.pass('Iterator called');
	})
	.then(() => {
		t.pass('should return a promise or a thenable');
	}, () => {
		t.fail('should not be called');
	});
});
