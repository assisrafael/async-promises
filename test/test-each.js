'use strict';

const test = require('ava');
const asyncP = require('../src/async-promises.js');

test('each', (t) => {
  const args = [];

  return asyncP
    .each(
      [1, 3, 2],
      (x) =>
        new Promise((resolve) => {
          setTimeout(() => {
            args.push(x);
            resolve();
          }, x * 25);
        })
    )
    .then(
      () => {
        t.deepEqual(args, [1, 2, 3]);
      },
      (err) => {
        t.fail(`should not throw an error: ${err}`);
      }
    );
});

test('each empty array', (t) =>
  asyncP
    .each([], () => {
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

test('each empty array, with other property on the array', (t) => {
  const myArray = [];

  myArray.myProp = 'anything';

  return asyncP
    .each(myArray, () => {
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

test('each error', (t) =>
  asyncP
    .each([1, 2, 3], () => Promise.reject('error'))
    .then(
      () => {
        t.fail('should not be called');
      },
      (err) => {
        t.deepEqual(err, 'error');
      }
    ));
