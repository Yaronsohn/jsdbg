/*!
 * jsdbg
 * Copyright(c) 2023 Yaron Aronsohn
 * MIT Licensed
 */

'use strict';

module.exports = TimeTracker;

function TimeTracker(options) {
  if (!(this instanceof TimeTracker))
    return new TimeTracker(options);

  this._suspended = 0;
  this._start = options?.start || Date.now();
  this._gaps = [];

  TimeTracker.prototype.gap = function(gap) {
    if (this._gaps.length === 0 || gap >= this._gaps.length)
      return undefined;

    if (gap < 0) {
      gap = this._gaps.length - 1;
    }

    return this._gaps[gap];
  }

  TimeTracker.prototype.gaps = function() {
    let total = 0;
    const now = Date.now();
    let g = 0;
    let gap;
    while (gap = this.gap(g++)) {
      total += ((gap.end ? gap.end : now) - gap.start);
    }

    return total;
  }

  TimeTracker.prototype.netTime = function() {
    return (Date.now() - this._start) - this.gaps();
  }

  TimeTracker.prototype.toString = function() {
    return `${this.netTime()}`;
  }

  function validateCount(count) {
    if (!count)
      return 1;

    if (typeof count !== 'number') {
      throw TypeError('count should be a number');
    }

    if (count < 1) {
      throw TypeError('count can not be negative');
    }

    return count;
  }

  TimeTracker.prototype.suspend = function(count) {
    count = validateCount(count)

    if (!this._suspended) {
      this._gaps.push({
        start: Date.now()
      });
    }

    this._suspended += count;
    return this._suspended;
  }

  TimeTracker.prototype.resume = function(count) {
    count = validateCount(count)

    if (this._suspended < count) {
      count = this._suspended;
    }

    this._suspended -= count;
    if (this._suspended === 0) {
      this._gaps[this._gaps.length - 1].end = Date.now();
    }

    return this._suspended;
  }

  if (options?.suspended) {
    this.suspend(options?.suspend);

    //
    // Just so the two conuter are the same.
    //
    this._gaps[0].start = this._start;
  }
}