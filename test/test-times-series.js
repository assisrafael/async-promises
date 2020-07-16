'use strict';

const test = require('ava');
const asyncP = require('../src/async-promises.js');

test('timesSeries', (t) => {
  const call_order = [];

  return asyncP
    .timesSeries(
      5,
      (n) =>
        new Promise((resolve) => {
          setTimeout(() => {
            call_order.push(n);
            resolve(n);
          }, 100 - n * 10);
        })
    )
    .then(
      (results) => {
        t.deepEqual(call_order, [0, 1, 2, 3, 4]);
        t.deepEqual(results, [0, 1, 2, 3, 4]);
      },
      (err) => {
        t.fail(`should not throw an error: ${err}`);
      }
    );
});

test('times error', (t) =>
  asyncP
    .times(5, () => {
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

test('times reject', (t) =>
  asyncP
    .times(5, () => Promise.reject('error'))
    .then(
      () => {
        t.fail('should not be called');
      },
      (err) => {
        t.deepEqual(err, 'error');
      }
    ));
