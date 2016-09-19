var assert = require('chai').assert;
var State = require('../lib/state.js');
describe('State', function() {
    describe('State()', function () {
        var s1 = State();
        it('should return pending when getStatus()', function() {
            var a = {};
            assert.equal('pending', s1.getStatus());
        });
        it('should return Error when run() beacuse no machine', function() {
            assert.throws(function () {
                s1.run();
            });
        });
        it('should return pending when after run() and get error', function() {
            assert.equal('pending', s1.getStatus());
        });
        it('should return pending when done() and run() get error', function() {
            assert.equal('pending', s1.done().getStatus());
        });
    });

    describe('State(machine, options)', function () {
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
        var s1 = State(machine, options);
        it('should return pending when getStatus()', function() {
            var a = {};
            assert.equal('pending', s1.getStatus());
        });
        it('should return pending when done()', function() {
            assert.equal('pending', s1.done().getStatus());
        });
        it('should return "c" when run()', function() {
            assert.equal('c', s1.run());
        });
        it('should return 1 after run() and do afterDoing()', function() {
            assert.equal(1, i);
        });
        it('should return doing when after run()', function() {
            assert.equal('doing', s1.getStatus());
        });
        it('should return undefined when again run()', function() {
            assert.equal(undefined, s1.run());
        });
        it('should return 1 after again run() and do afterDoing()', function() {
            assert.equal(1, i);
        });
        it('should return doing when after again run()', function() {
            assert.equal('doing', s1.getStatus());
        });

        it('should return done when done()', function() {
            assert.equal('done', s1.done().getStatus());
        });
        it('should return 2 after done() and do afterDone()', function() {
            assert.equal(2, i);
        });

        it('should return done when agin done()', function() {
            assert.equal('done', s1.done().getStatus());
        });
        it('should return 2 after agin done() and do afterDone()', function() {
            assert.equal(2, i);
        });
    });

    describe('State(machine, options) and machine isPromise setTimeout 100', function () {
        var machine = function () {
            var promise = new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, 100);
            });
            return promise;
        };
        var s2 = State(machine2);

        var machine2 = function () {
            var promise = new Promise(function (resolve, reject) {
                setTimeout(function () {
                    reject();
                }, 100);
            });
            return promise;
        };
        var s1 = State(machine);
        it('should return true when run() instanceof Promise', function() {
            assert.instanceOf(s1.run(), Promise);
        });
        it('should return false when agian run() instanceof Promise', function() {
            assert.notInstanceOf(s1.run(), Promise);
        });
        it('should return doing when after run() and getStatus()', function() {
            assert.equal('doing', s1.getStatus());
        });
        setTimeout(function () {
            it('should return done when after run() dalay 500 and getStatus() and promise is reslove', function() {
                assert.equal('done', s1.getStatus());
            });
        }, 500);
        setTimeout(function () {
            it('should return done when after run() dalay 500 and getStatus() and promise is reject', function() {
                assert.equal('done', s2.getStatus());
            });
        }, 500);
    });
    describe('State(machine, options) and machine like Promise', function () {
        var i = 0;
        var machine = function () {
            return {
                then: function (cb) {
                    cb && cb();
                }
            };
        };
        var s1 = State(machine);
        s1.run();
        it('should return done when getStatus()', function() {
            var a = {};
            assert.equal('done', s1.getStatus());
        });

    });
});