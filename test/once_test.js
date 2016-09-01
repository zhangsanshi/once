var assert = require('chai').assert;
var Once = require('../lib/once.js');
var State = require('../lib/state.js');
describe('Once', function() {
    describe('Once(name)', function () {
        var a = Once('a');
        it('should return undefined when Once("a")', function() {
            assert.equal(undefined, a);
        });
    });
    var a = Once('a', function () {

    });
    describe('Once(name, machine)', function () {
        it('should return State when instanceOf Once("a", machine)', function() {
            assert.instanceOf(a, State);
        });
        var b = Once('a');
        it('should return true when Once("a") equal Once("a", machine)', function() {
            assert.equal(true, a === b);
        });
        var i = 0;
        var c = Once('a', function () {
            return ++i;
        }, {
            force: true
        });
        it('should return true when change Once("a", machine) and run()', function() {
            assert.equal(1, c.run());
        });
    });
    describe('Once.remove("a")', function () {
        var a = Once('a', function () {

        });
        Once.remove('a');
        a = Once('a');
        it('should return undefined when Once.remove("a")', function() {
            assert.equal(undefined, a);
        });
    });
    describe('Once.one("a")', function () {
        var a = Once.one('a', function () {
            a.done();
        });
        var b = Once.one('a');

        it('should return true when Once.one("a", machine) === Once.one("a")', function() {
            assert.equal(b, a);
        });
        a.run();
        var c = Once.one('a');
        it('should return undefined when after run() and done() and get  Once.one("a")', function() {
            assert.equal(undefined, c);
        });
    });
});