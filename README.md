# async-promises [![Build Status](https://travis-ci.org/assisrafael/async-promises.svg)](https://travis-ci.org/assisrafael/async-promises)

[![NPM](https://nodei.co/npm/async-promises.png?compact=true)](https://nodei.co/npm/async-promises/)

Async control flow patterns using promises based on https://github.com/caolan/async

It needs an ES6 environment to work (Promises, Block-scoped binding constructs, etc) like modern browsers and node 4.

Example:

```javascript
var asyncP = require('async-promises');

var args = [];
return asyncP.each([1, 3, 2], (x) => {
  return new Promise(function(resolve) {
    setTimeout(() => {
      args.push(x);
      resolve();
    }, x * 25);
  });
})
.then(() => {
  console.log(args); //prints [1, 2, 3]
});
```


## Roadmap

- Collections
 - [x] each
 - [x] eachSeries
 - [ ] map
 - [ ] mapSeries
 - [ ] filter
 - [ ] filterSeries
 - [ ] reduce
 - [ ] reduceRight
 - [ ] some
 - [ ] every
- Control Flow
 - [x] series
 - [x] parallel
 - [x] waterfall
 - [ ] retry
 - [x] times
 - [x] timesSeries
