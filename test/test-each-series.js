'use strict';

import test from 'ava';
import * as asyncP from '../src/async-promises.js';

test('eachSeries', t => {
	var args = [];
	asyncP.eachSeries([1, 2, 3], (x) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				args.push(x);
				resolve();
			}, 25);
		});
	})
	.then(() => {
		t.same(args, [1, 2, 3]);
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	})
	.then(t.end);
});

test('eachSeries empty array', t => {
	asyncP.eachSeries([], (x) => {
		t.fail('iterator should not be called');
	})
	.then(() => {
		t.pass('should return a promise or a thenable');
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	})
	.then(t.end);
});

test('eachSeries empty array, with other property on the array', t => {
	var myArray = [];
	myArray.myProp = 'anything';
	asyncP.eachSeries(myArray, (x) => {
		t.fail('iterator should not be called');
	})
	.then(() => {
		t.pass('should return a promise or a thenable');
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	})
	.then(t.end);
});

test('eachSeries error', t => {
	asyncP.eachSeries([1, 2, 3], (x) => {
		return Promise.reject('error');
	})
	.then(() => {
		t.fail('should not be called');
	}, (err) => {
		t.same(err, 'error');
	})
	.then(t.end);
});
