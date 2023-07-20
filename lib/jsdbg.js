/*!
 * jsdbg
 * Copyright(c) 2023 Yaron Aronsohn
 * MIT Licensed
 */

'use strict';

/*
 * Module dependencies
 */

var tracker = require('./TimeTracker');
var stack = require('./debug');

exports = module.exports = {
  TimeTracker: tracker,
  Stack: stack,
}
