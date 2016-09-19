var assert = require('chai').assert;
var Once = require('../lib/once.js');
describe('Once', function() {
    describe('Once(name)', function () {
        var a = Once('c');
        it('should return undefined when Once(name)', function() {
            assert.equal(undefined, a);
        });
        Once.remove('c');
    });
    describe('Once(name, machine)', function () {
        var a = Once('a', function () {

        });
        var b = Once('a');
        it('should return true when Once("a") equal Once("a", machine)', function() {
            assert.equal(true, a === b);
        });
        Once.remove('a');
    });
    describe('Once.remove("a")', function () {
        var a = Once('a', function () {

        });
        Once.remove('a');
        var b = Once('a');
        it('should return undefined when Once.remove("a")', function() {
            assert.equal(undefined, b);
        });
        Once.remove('a');
    });
    describe('Once.one(name, machine)', function () {
        var i = 0;
        var a = Once.one('a', function () {
            a.done();
            return {};
        }, {
            afterDone: function () {
                i = i + 1;
            }
        });
        var b = Once.one('a');
        it('should return true when Once.one(name, machine) === Once.one(name)', function() {
            assert.equal(b, a);
        });
        var a_result = a.run();
        var c = Once.one('a');
        it('should return undefined when after run() and done() and get Once.one(name)', function() {
            assert.equal(undefined, c);
        });
        it('should a_result === a_result_new when after a_result=run() and done() then a_result_new = run()', function() {
            assert.equal(a_result, a.run());
        });
        it('should doesNotThrow when after run() and done() then done()', function() {
            assert.doesNotThrow(a.done, Error);
        });
        it('should doesNotThrow when Once.remove(name) then destory()', function() {
            assert.doesNotThrow(a.destory, Error);
        });
        it('should return true when done() and afterDone()', function() {
            assert.equal(1, i);
        });
    });
});