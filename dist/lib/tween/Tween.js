"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const TweenSugar_1 = require("./TweenSugar");
const TWEEN = require('@tweenjs/tween.js');
let idCounter = 0;
class Tween {
    constructor(value, options = settings_1.defaultOptions) {
        this.value = value;
        this.options = options;
        this.id = idCounter += 1;
        this.resolvers = [];
    }
    // TODO make sure arithmetic isn't changed
    get arithmetic() {
        return settings_1.getArithmetic(this.value);
    }
    onTweenCompleted() {
        delete this.internalTween.__owner;
        delete this.internalTween;
        while (this.resolvers.length) {
            this.resolvers.pop()(this.value);
        }
    }
    stop() {
        if (this.internalTween) {
            this.internalTween.stop();
            delete this.internalTween;
        }
    }
    instruct(inst) {
        this.lastInstruction = inst;
        // Merge tween options with expression options
        inst = inst.extend({ options: this.options.extend(inst.options) });
        this.stop();
        if (inst.from !== undefined) {
            this.value = inst.from;
        }
        return new Promise((resolve) => {
            this.resolvers.push(resolve);
            let duration = inst.options.duration;
            if (inst.speed !== undefined) {
                const delta = this.arithmetic.abs(this.arithmetic.subtract(inst.to, this.value));
                const numberOfFrames = this.arithmetic.maxDivide(delta, inst.speed);
                duration = 16 * numberOfFrames;
            }
            if (duration === undefined) {
                throw new Error('Either speed or duration must be configured for tween instructions');
            }
            const tweenTarget = { progress: 0 };
            this.internalTween = new TWEEN.Tween(tweenTarget);
            this.internalTween.__owner = this;
            const startValue = this.value;
            const delta = this.arithmetic.subtract(inst.to, startValue);
            this.internalTween
                .easing(inst.options.easing.get.bind(inst.options.easing))
                .delay(inst.options.delay)
                .to({ progress: 1 }, duration)
                .onUpdate(() => {
                this.value = this.arithmetic.parse(this.arithmetic.add(startValue, this.arithmetic.multiply(delta, tweenTarget.progress)));
            })
                .onComplete(this.onTweenCompleted.bind(this))
                .start();
        });
    }
    // Syntax sugar for common tween instructions
    set(value) {
        this.value = value;
    }
    toggle(offValue, onValue, isOn, options) {
        return this.instruct(TweenSugar_1.TweenSugar.default.toggle(offValue, onValue, isOn, options));
    }
    to(to, props = {}) {
        return this.instruct(TweenSugar_1.TweenSugar.default.to(to, props));
    }
    from(from, props = {}) {
        return this.instruct(TweenSugar_1.TweenSugar.default.from(from, props));
    }
    transition(from, to, props = {}) {
        return this.instruct(TweenSugar_1.TweenSugar.default.transition(from, to, props));
    }
    static update() {
        TWEEN.update();
        return TWEEN.getAll().map((internalTween) => internalTween.__owner);
    }
}
exports.Tween = Tween;
