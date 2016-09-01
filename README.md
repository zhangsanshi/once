# Once
在注册的方法未执行完成前,不会再次执行该方法,在多次点击的时候特别有用

## 例子

多次使用
```javascript
    var ajax1 = One('ajax1', function () {
        // do something
        ajax1.done();
    }, {
        afterDoing: function () {
            console.log('afterDoing');
        },
        afterDone: function () {
            console.log('afterDone');
        }
    });
    xx.on('click', function() {
        One('ajax1').run();
        // same as `ajax1.run();`
    });
```

使用一次
```javascript
    xx.on('click', function() {
        var ajax1 = One.one('ajax1', function () {
            // do something
            ajax1.done();
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
    var ajax1 = One('ajax1', function () {
        // do something
        ajax1.done();
    }, {
        afterDoing: function () {
            console.log('afterDoing');
        },
        afterDone: function () {
            console.log('afterDone');
        }
    });
    Once.remove('ajax1');
```

## API

### Once(name, machine, options)

返回 `State`

- `name` `string` `required` 需要注册的方法名 

- `machine` `function` `optional` 需要执行的方法

- `options` `object` `optional` 

    + `options.force` `boolean` 替换已经存在的`name`的`machine`
    
    + `options.afterDoing` `function` 在 `machine` 方法调用后执行,即 `run()` 内部执行
    
    + `options.afterDone` `function` 在 `done()` 方法内部执行

### Once.one(name, machine, options)

返回 `State`

和 `Once(name, machine, options)` 的不同点在于执行一次后会调用 `Once.remove(name)`方法

### Once.remove(name)

移除注册的方法,销毁的时候用到,不要调用执行使用之前拿到的对象,`machine`方法已经不存在

### State 对象

### State.machine
待执行的方法

### State.doneTimes
执行次数计数

### State.state
当前的状态,值有 `pending` `doing` `done`

### State.one
是否被 `Once.one` 调用过

### State.getState()
获取当前的状态

### State.updateState()
更新当前的状态

### State.isDoing()
判断是否正在执行方法中

### State.run()
开始执行`machine`方法

### State.done()
执行`machine`方法完毕
