var assert = require('chai').assert;
var State = require('../lib/state.js');
describe('State', function() {
    describe('new State()', function () {
        var s1 = new State();
        it('should return pending when getState()', function() {
            var a = {};
            assert.equal('pending', s1.getState());
        });
        it('should return false when isDoing()', function() {
            assert.equal(false, s1.isDoing());
        });
        it('should return doing when updateState("doing")', function() {
            assert.equal('doing', s1.updateState('doing').getState());
        });
        it('should return pending when updateState("pending")', function() {
            assert.equal('pending', s1.updateState('pending').getState());
        });
        it('should return Error when run() beacuse no machine', function() {
            assert.throws(function () {
                s1.run();
            });
        });
        it('should return pending when after run() and get error', function() {
            assert.equal('pending', s1.getState());
        });
        it('should return pending when done() and run() get error', function() {
            assert.equal('pending', s1.done().getState());
        });
    });

    describe('new State(machine, options)', function () {
        var i = 0;
        var machine = function () {
            return 'c';
        };
        var options = {
            afterDoing: function () {
                i++;
            },
            afterDone: function () {
                i++;
            }
        };
        var s1 = new State(machine, options);
        it('should return pending when getState()', function() {
            var a = {};
            assert.equal('pending', s1.getState());
        });
        it('should return pending when done()', function() {
            assert.equal('pending', s1.done().getState());
        });
        it('should return false when isDoing()', function() {
            assert.equal(false, s1.isDoing());
        });
        it('should return doing when updateState("doing")', function() {
            assert.equal('doing', s1.updateState('doing').getState());
        });
        it('should return pending when updateState("pending")', function() {
            assert.equal('pending', s1.updateState('pending').getState());
        });
        it('should return "c" when run()', function() {
            assert.equal('c', s1.run());
        });
        it('should return 1 after run() and do afterDoing()', function() {
            assert.equal(1, i);
        });
        it('should return doing when after run()', function() {
            assert.equal('doing', s1.getState());
        });

        it('should return undefined when again run()', function() {
            assert.equal(undefined, s1.run());
        });
        it('should return 1 after again run() and do afterDoing()', function() {
            assert.equal(1, i);
        });
        it('should return doing when after again run()', function() {
            assert.equal('doing', s1.getState());
        });

        it('should return done when done()', function() {
            assert.equal('done', s1.done().getState());
        });
        it('should return 2 after done() and do afterDone()', function() {
            assert.equal(2, i);
        });
        it('should return 1 when get doneTimes', function() {
            assert.equal(1, s1.doneTimes);
        });

        it('should return done when agin done()', function() {
            assert.equal('done', s1.done().getState());
        });
        it('should return 2 after agin done() and do afterDone()', function() {
            assert.equal(2, i);
        });
        it('should return 1 when agin done() and get doneTimes', function() {
            assert.equal(1, s1.doneTimes);
        });
    });

    describe('new State(machine, options) and machine isPromise setTimeout 100', function () {
        var machine = function () {
            var promise = new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, 100);
            });
            return promise;
        };
        var s1 = new State(machine);

        it('should return true when run() instanceof Promise', function() {
            assert.instanceOf(s1.run(), Promise);
        });
        it('should return false when agian run() instanceof Promise', function() {
            assert.notInstanceOf(s1.run(), Promise);
        });
        it('should return doing when after run() and getState()', function() {
            assert.equal('doing', s1.getState());
        });
        setTimeout(function () {
            it('should return done when after run() dalay 500 and getState()', function() {
                assert.equal('done', s1.getState());
            });
        }, 500);
    });
});