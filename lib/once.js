var ns = require('./ns.js');
var state = require('./state.js');
var Util = require('./util.js');

function once(name, machine, options) {
  var stateInst = ns[name];
  options = options || {};
  if (!stateInst) {
    if (Util.isFunction(machine)) {
      stateInst = ns[name] = state(machine, options);
    }
  }
  return stateInst;
}

once.one = function one(name, machine, options) {
  var $afterDone;
  var self = this;
  if (arguments.length > 1) {
    options = options || {};
    $afterDone = options.afterDone;
    options.one = true;
    options.afterDone = function afterDone() {
      if ($afterDone && Util.isFunction($afterDone)) {
        $afterDone();
      }
      self.remove(name);
    };
  }
  return once(name, machine, options);
};

once.remove = function remove(name) {
  var stateInst = ns[name];
  if (stateInst) {
    stateInst.destory();
    delete ns[name];
  }
};

module.exports = once;
