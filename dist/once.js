(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Once"] = factory();
	else
		root["Once"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ns = __webpack_require__(1);
	var state = __webpack_require__(3);
	var Util = __webpack_require__(2);
	
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

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = {};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var NS = __webpack_require__(1);
	
	module.exports = {
	  toString: NS.toString,
	  isFunction: function isFunction(obj) {
	    return obj && this.toString.call(obj) === '[object Function]';
	  },
	  isPromise: function isPromise(obj) {
	    // 简单判断对象是不是 Promise 对象
	    return obj && this.isFunction(obj.then);
	  }
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Util = __webpack_require__(2);
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

/***/ }
/******/ ])
});
;