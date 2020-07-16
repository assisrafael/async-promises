'use strict';

const test = require('ava');
const asyncP = require('../src/async-promises.js');

test('eachSeries', (t) => {
  const args = [];
  const arr = [1, 2, 3];

  return asyncP
    .eachSeries(
      arr,
      (x) =>
        new Promise((resolve) => {
          setTimeout(() => {
            args.push(x);
            resolve();
          }, 25);
        })
    )
    .then(
      () => {
        t.deepEqual(args, arr);
      },
      (err) => {
        t.fail(`should not throw an error: ${err}`);
      }
    );
});

test('eachSeries empty array', (t) =>
  asyncP
    .eachSeries([], () => {
      t.fail('iterator should not be called');
    })
    .then(
      () => {
        t.pass('should return a promise or a thenable');
      },
      (err) => {
        t.fail(`should not throw an error: ${err}`);
      }
    ));

test('eachSeries empty array, with other property on the array', (t) => {
  const myArray = [];

  myArray.myProp = 'anything';

  return asyncP
    .eachSeries(myArray, () => {
      t.fail('iterator should not be called');
    })
    .then(
      () => {
        t.pass('should return a promise or a thenable');
      },
      (err) => {
        t.fail(`should not throw an error: ${err}`);
      }
    );
});

test('eachSeries reject error', (t) =>
  asyncP
    .eachSeries([1, 2, 3], () => Promise.reject('error'))
    .then(
      () => {
        t.fail('should not be called');
      },
      (err) => {
        t.deepEqual(err, 'error');
      }
    ));

test('eachSeries throw error', (t) =>
  asyncP
    .eachSeries([1, 2, 3], () => {
      throw 'error';
    })
    .then(
      () => {
        t.fail('should not be called');
      },
      (err) => {
        t.deepEqual(err, 'error');
      }
    ));

test('eachSeries with null element', (t) => {
  t.plan(2);

  return asyncP
    .eachSeries([null], () => {
      t.pass('Iterator called');
    })
    .then(
      () => {
        t.pass('should return a promise or a thenable');
      },
      () => {
        t.fail('should not be called');
      }
    );
});
