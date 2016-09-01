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
	var State = __webpack_require__(3);
	var Util = __webpack_require__(2);
	
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

/***/ }
/******/ ])
});
;