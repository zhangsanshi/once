var assert = require('chai').assert;
var Util = require('../lib/util.js');
describe('Util', function() {
    describe('toString', function() {
        var map = [
            {
                label: 'Object',
                data: {}
            },
            {
                label: 'Function',
                data: function () {}
            },
            {
                label: 'Number',
                data: 1
            },
            {
                label: 'String',
                data: ''
            },
            {
                label: 'Boolean',
                data: true
            },
            {
                label: 'Null',
                data: null
            },
            {
                label: 'Array',
                data: []
            },
            {
                label: 'Undefined'
            },
        ];
        for (var i = 0; i < map.length; i++) {
            var label = map[i].label;
            var data = map[i].data;
            (function (label, data) {
                it('should return [object ' + label + '] when the value is ' + label.toLowerCase(), function() {
                    var a = data;
                    assert.equal('[object ' + label + ']', Util.toString.call(a));
                });
            })(label, data);
        }
    });
    describe('isFunction', function () {
        it('should return true when the value is function', function() {
            var a = function(){};
            assert.equal(true, Util.isFunction(a));
        });
        it('should return false when the value is not function', function() {
            var a = {};
            assert.equal(false, Util.isFunction(a));
        });
    });
    describe('isPromise', function () {
        it('should return true when the value has then function', function() {
            var a = {
                then: function () {

                }
            };
            assert.equal(true, Util.isPromise(a));
        });
        it('should return undefined when the value not have then function', function() {
            var a = {};
            assert.equal(undefined, Util.isPromise(a));
        });
        it('should return undefined when the value undefined', function() {
            var a;
            assert.equal(undefined, Util.isPromise());
        });
        it('should return undefined when the value 1', function() {
            var a = 1;
            assert.equal(undefined, Util.isPromise(a));
        });
        it('should return false when the value 0', function() {
            var a = 0;
            assert.equal(false, Util.isPromise(a));
        });
    });
});