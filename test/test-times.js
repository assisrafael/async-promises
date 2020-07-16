'use strict';

const test = require('ava');
const asyncP = require('../src/async-promises.js');

test('times', (t) =>
  asyncP
    .times(5, (i) => i)
    .then(
      (results) => {
        t.deepEqual(results, [0, 1, 2, 3, 4]);
      },
      (err) => {
        t.fail(`should not throw an error: ${err}`);
      }
    ));

test('times 3', (t) => {
  const args = [];

  return asyncP
    .times(
      3,
      (n) =>
        new Promise((resolve) => {
          setTimeout(() => {
            args.push(n);
            resolve();
          }, n * 25);
        })
    )
    .then(
      () => {
        t.deepEqual(args, [0, 1, 2]);
      },
      (err) => {
        t.fail(`should not throw an error: ${err}`);
      }
    );
});

test('times 0', (t) =>
  asyncP
    .times(0, () => {
      t.fail('should not be called');
    })
    .then(() => {
      t.pass('should call callback');
    }));

test('times error', (t) =>
  asyncP
    .times(3, () => {
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
    .times(3, () => Promise.reject('error'))
    .then(
      () => {
        t.fail('should not be called');
      },
      (err) => {
        t.deepEqual(err, 'error');
      }
    ));
