// Multi-touch tracker adapted from https://patrickhlauke.github.io/touch/touchlist-objects/

type ObjectType = {
    [key: string]: any
};

type ObjectWithEvents = {
    events: {
        [eventName: string]: Function[]
    }
};

type DrawOptions = {
    ctx?: CanvasRenderingContext2D
};

type StageOptions = {
    canvas?: HTMLCanvasElement
};

const Events = {
    on(object: ObjectWithEvents, eventName: string, callbackFn: Function) {
        object.events[eventName] = object.events[eventName] || [];
        object.events[eventName].push(callbackFn);
    },
    off(object: ObjectWithEvents, eventName: string, callbackFn: Function) {
        const callbacks = object.events[eventName];
        const newCallbacks = [];
        if (callbacks instanceof Array) {
            for (const callback of callbacks) {
                if (callback !== callbackFn) {
                    newCallbacks.push(callback);
                }
            }
            object.events[eventName] = newCallbacks;
        }
    },
    trigger(object: ObjectWithEvents, eventNames: string | string[], events?: any) {
        if (!(eventNames instanceof Array)) {
            eventNames = [eventNames];
        }
        for (const eventName of eventNames) {
            const callbacks = object.events[eventName];
            if (callbacks instanceof Array) {
                for (const callback of callbacks) {
                    callback.call(object, events || { name: eventName, source: object });
                }
            }
        }
    }
};

class Draw {

    ctx: CanvasRenderingContext2D;
    mainCtx: CanvasRenderingContext2D;

    constructor(options: DrawOptions = {}) {
        this.init(options);
    }

    init(options: DrawOptions = {}) {
        if (options.ctx instanceof CanvasRenderingContext2D) {
            this.ctx = this.mainCtx = options.ctx;
        }
    }

    setColor(c: string) {
        this.ctx.fillStyle = c;
        this.ctx.strokeStyle = c;
    }

    draw(isStroke?: boolean) {
        isStroke
            ? this.ctx.stroke()
            : this.ctx.fill();
    }

    circle(x: number, y: number, r: number, isStroke?: boolean) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.draw(isStroke);
    }

    clear(w: number, h: number) {
        this.ctx.clearRect(0, 0, w, h);
    }
}

class Stage {

    w: number = 300;
    h: number = 150;
    mid = {
        w: 150,
        h: 75
    };
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    static createCanvas(): HTMLCanvasElement {
        return document.createElement('canvas');
    }

    constructor(options: StageOptions = {}) {
        this.canvas = Stage.createCanvas();
        this.init(options);
    }

    init(options: StageOptions = {}) {
        if (options.canvas instanceof HTMLCanvasElement) {
            this.canvas = options.canvas;
        }
        this.ctx = this.canvas.getContext('2d');
        this.reset();
    }

    reset() {
        if (!(this.canvas instanceof HTMLCanvasElement)) return;
        const dpi = window.devicePixelRatio || 2;
        const b = this.canvas.getBoundingClientRect();
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
    }
}

class Runner {

    events = {};

    constructor() {}

    run() {
        Events.trigger(this, 'run');
        window.requestAnimationFrame(() => this.run());
    }
}

const stage = new Stage({
    canvas: document.querySelector('canvas')
});

const draw = new Draw({
    ctx: stage.ctx
});

const runner = new Runner();

Events.on(runner, 'run', () => {
    draw.clear(stage.w, stage.h);
    draw.setColor('green');
    draw.circle(32, 32, 8, true);
});

runner.run();