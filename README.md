# Once
在注册的方法未执行完成前,不会再次执行该方法,在多次点击的时候特别有用

[![Build Status](https://travis-ci.org/zhangsanshi/once.svg?branch=master)](https://travis-ci.org/zhangsanshi/once)
[![codecov](https://codecov.io/gh/zhangsanshi/once/branch/master/graph/badge.svg)](https://codecov.io/gh/zhangsanshi/once)
## 例子

多次使用
```javascript
    var ajax3 = Once('ajax3', function () {
        // do something
        setTimeout(function () {
            ajax3.done();
        }, 3 * 1000);
    }, {
        afterDoing: function () {
            console.log('afterDoing');
        },
        afterDone: function () {
            console.log('afterDone');
        }
    });
    $('#yy').on('click', function() {
        Once('ajax3').run();
        // same as `ajax3.run();`
    });
```

使用一次
```javascript
    var ajax1 = Once.one('ajax1', function () {
        // do something
        setTimeout(function () {
            ajax1.done();
        }, 1000 * 3);
    }, {
        afterDoing: function () {
            console.log('afterDoing');
        },
        afterDone: function () {
            console.log('afterDone');
        }
    });
    ajax1.run();
});
```

删除注册的方法
```javascript
    var ajax2 = Once('ajax2', function () {
        // do something
        ajax2.done();
    }, {
        afterDoing: function () {
            console.log('afterDoing');
        },
        afterDone: function () {
            console.log('afterDone');
        }
    });
    ajax2.run();
    ajax2.run();
    Once.remove('ajax2');
    ajax2.run(); //not run
```

单例模式(just for fun)
```javascript
    function Person() {
    
    }
    var p = Once.one('person', function () {
        p.done();
        return new Person();
    }
    var p1 = p.run();
    var p2 = p.run();
    var p3 = p.run();
    console.log(p1 === p2, p2 === p3);
```

## API

### Once(name, machine, options)

返回 `State`

- `name` `string` `required` 需要注册的方法名 

- `machine` `function` `optional` 需要执行的方法

- `options` `object` `optional` 
    
    + `options.afterDoing` `function` 在 `run()` 方法调用后执行
    
    + `options.afterDone` `function` 在 `done()` 方法调用后执行

### Once.one(name, machine, options)

返回 `State`

和 `Once(name, machine, options)` 的不同点在于执行一次后在 `done` 方法里会调用 `destory()` 方法,同时再次调用 `run()`,会返回上次的结果

### Once.remove(name)

移除方法

### State 对象

### State.run()
开始执行`machine`方法

### State.done()
执行`machine`方法完毕

### State.destory()
销毁 `State` 对象

### State.getStatus()
获取 `State` 状态 `doing pending done`
