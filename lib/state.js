var Util = require('./util.js');
module.exports = function State(machine, options) {
  var afterDoing;
  var afterDone;
  var one;
  var memory;
  var state = {
    status: 'pending',
    updateStatus: function updateStatus(status) {
      this.status = status;
      return this;
    },
    isDoing: function isDoing() {
      return this.status === 'doing';
    },
    isDestory: function isDestory() {
      return this.status === 'destory';
    },
    destory: function destory() {
      this.updateStatus('destory');
      this.machine = null;
    }
  };

  options = options || {};
  afterDoing = options.afterDoing;
  afterDone = options.afterDone;
  one = options.one;
  state.machine = machine;
  return {
    run: function run() {
      var machineResult;
      var self = this;
      function onDone() {
        self.done();
      }
      if (state.isDestory()) {
        return memory;
      }
      if (!state.isDoing()) {
        state.updateStatus('doing');
        try {
          machineResult = state.machine();
        } catch (e) {
          state.updateStatus('pending');
          throw new Error(e);
        }
        if (Util.isFunction(afterDoing)) {
          afterDoing();
        }
        if (Util.isPromise(machineResult)) {
          machineResult = machineResult.then(onDone, onDone);
        }
      }
      if (one) {
        memory = machineResult;
      }
      return machineResult;
    },
    getStatus: function getStatus() {
      return state.status;
    },
    done: function done() {
      if (state.isDestory() && !state.isDoing()) {
        return null;
      }
      if (state.isDoing()) {
        state.updateStatus('done');
        if (Util.isFunction(afterDone)) {
          afterDone();
        }
      }
      if (one) {
        this.destory();
      }
      return this;
    },
    destory: function destory() {
      state.destory();
    }
  };
};
