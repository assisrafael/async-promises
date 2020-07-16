'use strict';

const test = require('ava');
const asyncP = require('../src/async-promises.js');

test('waterfall', (t) => {
  const callOrder = [];

  return asyncP
    .waterfall([
      function () {
        return new Promise((resolve) => {
          callOrder.push('fn1');
          setTimeout(() => {
            resolve(['one', 'two']);
          }, 0);
        });
      },
      function (arg1, arg2) {
        callOrder.push('fn2');
        t.is(arg1, 'one');
        t.is(arg2, 'two');

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([arg1, arg2, 'three']);
          }, 25);
        });
      },
      function (arg1, arg2, arg3) {
        callOrder.push('fn3');
        t.is(arg1, 'one');
        t.is(arg2, 'two');
        t.is(arg3, 'three');

        return 'four';
      },
      function (arg4) {
        callOrder.push('fn4');
        t.is(arg4, 'four');

        return Promise.resolve('test');
      },
    ])
    .then(
      (result) => {
        t.deepEqual(callOrder, ['fn1', 'fn2', 'fn3', 'fn4']);
        t.is(result, 'test');
      },
      (err) => {
        t.fail(`should not throw an error: ${err}`);
      }
    );
});

test('waterfall empty array', (t) =>
  asyncP.waterfall([]).then(
    (result) => {
      t.is(result, undefined);
    },
    (err) => {
      t.fail(`should not throw an error: ${err}`);
    }
  ));

test('waterfall non-array', (t) =>
  asyncP.waterfall({}).then(
    () => {
      t.fail('should not be called');
    },
    (err) => {
      t.is(err.message, 'First argument to waterfall must be an array of functions');
    }
  ));

test('waterfall reject error', (t) =>
  asyncP
    .waterfall([
      () =>
        new Promise(() => {
          throw new Error('error');
        }),
      () => {
        t.fail('should not be called');
      },
    ])
    .then(
      () => {
        t.fail('should not be called');
      },
      (err) => {
        t.is(err.message, 'error');
      }
    ));

test('waterfall throw error', (t) =>
  asyncP
    .waterfall([
      function () {
        throw new Error('error');
      },
      function () {
        t.fail('should not be called');
      },
    ])
    .then(
      () => {
        t.fail('should not be called');
      },
      (err) => {
        t.is(err.message, 'error');
      }
    ));
