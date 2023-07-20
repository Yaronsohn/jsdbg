/*!
 * jsdbg
 * Copyright(c) 2023 Yaron Aronsohn
 * MIT Licensed
 */

module.exports = Stack;

function Stack(options) {
  if (!(this instanceof Stack))
    return new Stack(options);

  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack) {
    return stack;
  }

  var err = new Error;
  Error.captureStackTrace(err, arguments.callee);

  this._frames = err.stack;
  Error.prepareStackTrace = orig;

  Stack.prototype.toString = function() {
    let str = '';
    for (const i in this._frames) {
      str += `   at ${this._frames[i].toString()}\n`;
    }

    return str;
  }
}

Object.defineProperty(global, '__stack', {
  get: function() {
    return new Stack();
  }
});

// Object.defineProperty(global, '__line', {
//   get: function() {
//     return (new Stack())._frames[1].getLineNumber();
//   }
// });

Object.defineProperty(global, '__function', {
  get: function() {
    return (new Stack())._frames[1].getFunctionName();
  }
});