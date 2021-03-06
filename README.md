# middlemitter

Middleware + Event Emitter for node.js

[![Build Status](https://travis-ci.org/smbeiragh/middlemitter.svg?branch=master)](https://travis-ci.org/smbeiragh/middlemitter)
[![codecov](https://codecov.io/gh/smbeiragh/middlemitter/branch/master/graph/badge.svg)](https://codecov.io/gh/smbeiragh/middlemitter)

[![NPM](https://nodei.co/npm/middlemitter.png)](https://nodei.co/npm/middlemitter/)

1. async middlewares
2. async/sync event listeners
3. support priority for both middlewares and event listeners

## Environment
Every ES5 compliant environment + Promise Api & Symbol.iterator.
In case of unsupported environments you can use appropriate polyfill(s).

## Installation

Using yarn: 

```bash
yarn add middlemitter
``` 
Using npm:

```bash
npm install middlemitter
```

## Usage

Importing
```js
import { MiddlEmitter } from 'middlemitter';

const emitter = new MiddlEmitter();
```

Add/Remove listener on test event
```js
const listener = emitter.on('test', (a,b,c) => {
  console.log('>>', a, b, c);
});

emitter.off('test', listener);
```

Add listener on test event with priority
```js
emitter.on('test', (a,b,c) => {
  console.log('second');
}, 10);

emitter.on('test', (a,b,c) => {
  console.log('first');
}, 11);
```

Emit test event
Returns promise that resolves when all listeners executed.
```js
emitter.emit('test', 'a', 'b', 'c');
```

Use middleware on test event 
```js
emitter.use('test', async (params) => {
   const [a,b,c] = params;
   // Mutate params array
   params[0] = `(${a})`;
   params[1] = `(${b})`;
   params[2] = `(${c})`;
   // Await for other middleware or just skip them all 
   await next();
});

emitter.on('test', (a,b,c) => {
  // This will log (a)(b)(c)
  console.log(a,b,c);
});

emitter.emit('test', 'a', 'b', 'c');
```

Use middleware on test event with specific priority
```js
emitter.use('test', async (params) => {
   const [a,b,c] = params;
   // Mutate params array
   params[0] = `(${a})`;
   params[1] = `(${b})`;
   params[2] = `(${c})`;
   // Await for other middleware or just skip them all 
   await next();
}, 10);

emitter.use('test', async (params) => {
   const [a,b,c] = params;
   // Mutate params array
   params[0] = `{${a}}`;
   params[1] = `{${b}}`;
   params[2] = `{${c}}`;
   // Await for other middleware or just skip them all 
   await next();
}, 11);

emitter.on('test', (a,b,c) => {
  // This will log ({a})({b})({c})
  console.log(a,b,c);
});

emitter.emit('test', 'a', 'b', 'c');
```

Add middleware on test event at once
```js
emitter.use(
  'test',
  async (params, next) => {
    const [a,b,c] = params;
    // Mutate params array
    params[0] = `{${a}}`;
    params[1] = `{${b}}`;
    params[2] = `{${c}}`;
    await next();
  },
  async (params, next) => {
    const [a,b,c] = params;
    // Mutate params array
    params[0] = `(${a})`;
    params[1] = `(${b})`;
    params[2] = `(${c})`;
    await next();
  },
  10 // priority optional, default: 0
);

emitter.on('test', (a,b,c) => {
  // This will log ({a})({b})({c})
  console.log(a,b,c);
});

emitter.emit('test', 'a', 'b', 'c');
```

Async listeners
```js
const delay = (ms) => new Promise((resolve, reject) => {
    setTimeout(() => { resolve(); }, ms);
  });

emitter.on('test', async (a,b,c) => {
  await delay(1000);
  console.log('first');
});

emitter.on('test', (a,b,c) => {
  console.log('second, just after 1000 ms delay');
});
```

## Contributing
1. Fork repository
2. Commit your code on feature/branch or bugfix/branch
3. Write tests for new feature or bugs as needed
3. All codes should pass eslint guide

## TODO
1. TODO(s) in listener_handler module
3. Improve test coverage
4. Improve README.md

## License
MIT License

Copyright (c) 2017 Sajjad Mahdi Beiraghdar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.