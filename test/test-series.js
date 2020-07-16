'use strict';

const test = require('ava');
const asyncP = require('../src/async-promises.js');

test('series', (t) => {
  const callOrder = [];

  return asyncP
    .series([
      function () {
        return new Promise((resolve) => {
          setTimeout(() => {
            callOrder.push(1);
            resolve(1);
          }, 25);
        });
      },
      function () {
        return new Promise((resolve) => {
          setTimeout(() => {
            callOrder.push(2);
            resolve(2);
          }, 50);
        });
      },
      function () {
        return new Promise((resolve) => {
          setTimeout(() => {
            callOrder.push(3);
            resolve([3, 3]);
          }, 15);
        });
      },
    ])
    .then(
      (results) => {
        t.deepEqual(callOrder, [1, 2, 3]);
        t.deepEqual(results, [1, 2, [3, 3]]);
      },
      (err) => {
        t.fail(`should not throw an error: ${err}`);
      }
    );
});

test('series empty array', (t) =>
  asyncP.series([]).then(
    (results) => {
      t.deepEqual(results, []);
    },
    (err) => {
      t.fail(`should not throw an error: ${err}`);
    }
  ));

test('series error', (t) =>
  asyncP
    .series([
      function () {
        return new Promise(() => {
          throw new Error('error');
        });
      },
      function () {
        t.fail(`should not be called`);
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

test('series object', (t) => {
  const callOrder = [];

  return asyncP
    .series({
      one() {
        return new Promise((resolve) => {
          setTimeout(() => {
            callOrder.push(1);
            resolve(1);
          }, 50);
        });
      },
      two() {
        return new Promise((resolve) => {
          setTimeout(() => {
            callOrder.push(2);
            resolve(2);
          }, 75);
        });
      },
      three() {
        return new Promise((resolve) => {
          setTimeout(() => {
            callOrder.push(3);
            resolve([3, 3]);
          }, 25);
        });
      },
    })
    .then(
      (results) => {
        t.deepEqual(callOrder, [1, 2, 3]);
        t.deepEqual(results, {
          one: 1,
          two: 2,
          three: [3, 3],
        });
      },
      (err) => {
        t.fail(`should not throw an error: ${err}`);
      }
    );
});

test('series falsy return values', (t) =>
  asyncP
    .series({
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
      },
    })
    .then(
      (results) => {
        t.is(results.falseValue, false);
        t.is(results.undefinedValue, undefined);
        t.is(results.emptyValue, undefined);
        t.is(results.nullValue, null);
      },
      (err) => {
        t.fail(`should not throw an error: ${err}`);
      }
    ));

test('series should not allow values other than array and object', (t) =>
  asyncP.series('should not allow and string').then(
    () => {
      t.fail(`should not be executed`);
    },
    (err) => {
      t.pass(`should not throw an error: ${err}`);
    }
  ));
