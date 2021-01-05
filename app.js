// Multi-touch tracker adapted from https://patrickhlauke.github.io/touch/touchlist-objects/
var Events = {
    on: function (object, eventName, callbackFn) {
        object.events[eventName] = object.events[eventName] || [];
        object.events[eventName].push(callbackFn);
    },
    off: function (object, eventName, callbackFn) {
        var callbacks = object.events[eventName];
        var newCallbacks = [];
        if (callbacks instanceof Array) {
            for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
                var callback = callbacks_1[_i];
                if (callback !== callbackFn) {
                    newCallbacks.push(callback);
                }
            }
            object.events[eventName] = newCallbacks;
        }
    },
    trigger: function (object, eventNames, events) {
        if (!(eventNames instanceof Array)) {
            eventNames = [eventNames];
        }
        for (var _i = 0, eventNames_1 = eventNames; _i < eventNames_1.length; _i++) {
            var eventName = eventNames_1[_i];
            var callbacks = object.events[eventName];
            if (callbacks instanceof Array) {
                for (var _a = 0, callbacks_2 = callbacks; _a < callbacks_2.length; _a++) {
                    var callback = callbacks_2[_a];
                    callback.call(object, events || { name: eventName, source: object });
                }
            }
        }
    }
};
var Draw = /** @class */ (function () {
    function Draw(options) {
        if (options === void 0) { options = {}; }
        this.init(options);
    }
    Draw.prototype.init = function (options) {
        if (options === void 0) { options = {}; }
        if (options.ctx instanceof CanvasRenderingContext2D) {
            this.ctx = this.mainCtx = options.ctx;
        }
    };
    Draw.prototype.setColor = function (c) {
        this.ctx.fillStyle = c;
        this.ctx.strokeStyle = c;
    };
    Draw.prototype.draw = function (isStroke) {
        isStroke
            ? this.ctx.stroke()
            : this.ctx.fill();
    };
    Draw.prototype.circle = function (x, y, r, isStroke) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.draw(isStroke);
    };
    Draw.prototype.clear = function (w, h) {
        this.ctx.clearRect(0, 0, w, h);
    };
    return Draw;
}());
var Stage = /** @class */ (function () {
    function Stage(options) {
        if (options === void 0) { options = {}; }
        this.w = 300;
        this.h = 150;
        this.mid = {
            w: 150,
            h: 75
        };
        this.canvas = Stage.createCanvas();
        this.init(options);
    }
    Stage.createCanvas = function () {
        return document.createElement('canvas');
    };
    Stage.prototype.init = function (options) {
        if (options === void 0) { options = {}; }
        if (options.canvas instanceof HTMLCanvasElement) {
            this.canvas = options.canvas;
        }
        this.ctx = this.canvas.getContext('2d');
        this.reset();
    };
    Stage.prototype.reset = function () {
        if (!(this.canvas instanceof HTMLCanvasElement))
            return;
        var dpi = window.devicePixelRatio || 2;
        var b = this.canvas.getBoundingClientRect();
        this.w = b.width;
        this.h = b.height;
        this.mid.w = this.w / 2;
        this.mid.h = this.h / 2;
        this.canvas.width = this.w * dpi;
        this.canvas.height = this.h * dpi;
        if (this.ctx.resetTransform !== undefined) {
            this.ctx.resetTransform();
        }
        this.ctx.scale(dpi, dpi);
    };
    return Stage;
}());
var Runner = /** @class */ (function () {
    function Runner() {
        this.events = {};
    }
    Runner.prototype.run = function () {
        var _this = this;
        Events.trigger(this, 'run');
        window.requestAnimationFrame(function () { return _this.run(); });
    };
    return Runner;
}());
var stage = new Stage({
    canvas: document.querySelector('canvas')
});
var draw = new Draw({
    ctx: stage.ctx
});
var runner = new Runner();
Events.on(runner, 'run', function () {
    draw.clear(stage.w, stage.h);
    draw.setColor('green');
    draw.circle(32, 32, 8, true);
});
runner.run();
