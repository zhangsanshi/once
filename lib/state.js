var Util = require('./util.js');
var stateLabel = {
  pending: true,
  doing: true,
  done: true
};

function State(machine, options) {
  options = options || {};
  this.state = 'pending';
  this.machine = machine;
  this.doneTimes = 0;
  this.afterDoing = options.afterDoing;
  this.afterDone = options.afterDone;
}

State.prototype = {
  getState: function getState() {
    return this.state;
  },
  updateState: function updateState(state) {
    if (stateLabel[state]) {
      this.state = state;
    }
    return this;
  },
  isDoing: function isDoing() {
    return this.state === 'doing';
  },
  run: function run() {
    var machine = null;
    var slef = this;
    function onDone() {
      slef.done();
    }
    if (!this.isDoing()) {
      this.updateState('doing');
      try {
        machine = this.machine();
      } catch (e) {
        this.updateState('pending');
        throw new Error(e);
      }
      if (Util.isFunction(this.afterDoing)) {
        this.afterDoing();
      }
      if (Util.isPromise(machine)) {
        machine = machine.then(onDone, onDone);
      }
    }
    return machine;
  },
  done: function done() {
    if (this.isDoing()) {
      if (Util.isFunction(this.afterDone)) {
        this.afterDone();
      }
      if (this.one && Util.isFunction(this.$afterDone)) {
        this.$afterDone();
      }
      this.updateState('done');
      this.doneTimes++;
    }
    return this;
  }
};
module.exports = State;
