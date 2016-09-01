var ns = require('./ns.js');
var State = require('./state.js');
var Util = require('./util.js');

function Once(name, machine, options) {
  var module = ns[name];
  options = options || {};
  if (!module) {
    if (Util.isFunction(machine)) {
      module = ns[name] = new State(machine, options);
    }
  } else if (options.force && Util.isFunction(machine)) {
    module.machine = machine;
  }
  return module;
}

Once.one = function one(name) {
  var module = Once.apply(Once, arguments);
  if (module && !module.one) {
    module.$afterDone = function $afterDone() {
      Once.remove(name);
    };
    module.one = true;
  }
  return module;
};

Once.remove = function remove(name) {
  delete ns[name];
};

module.exports = Once;
