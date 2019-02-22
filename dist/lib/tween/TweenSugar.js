"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const TweenInstruction_1 = require("./TweenInstruction");
const Tween_1 = require("./Tween");
class TweenSugar {
    constructor(options) {
        this.options = options;
    }
    toggle(offValue, onValue, isOn, options) {
        options = this.options.extend(options);
        const arithmetic = settings_1.getArithmetic(offValue);
        const toValue = isOn ? onValue : offValue;
        if (arithmetic.equals(offValue, onValue)) {
            // Optimise redundant toggles without breaking API (they're mostly misconfigurations)
            return this.to(toValue, { options: options.extend({ duration: 0 }) });
        }
        // For relevant toggles we need to calculate a speed
        const numberOfFrames = options.duration / 16;
        const delta = arithmetic.abs(arithmetic.subtract(onValue, offValue));
        const speed = arithmetic.scalarDivide(delta, numberOfFrames);
        return new TweenInstruction_1.default({ speed, options, to: toValue });
    }
    to(to, props = {}) {
        const { options } = props, rest = __rest(props, ["options"]);
        const extendedOptions = this.options.extend(options);
        return new TweenInstruction_1.default(Object.assign({ to }, rest, { options: extendedOptions }));
    }
    from(from, props = {}) {
        const { options } = props, rest = __rest(props, ["options"]);
        const extendedOptions = this.options.extend(options);
        return new TweenInstruction_1.default(Object.assign({ from }, rest, { options: extendedOptions }));
    }
    transition(from, to, props = {}) {
        const { options } = props, rest = __rest(props, ["options"]);
        const extendedOptions = this.options.extend(options);
        return new TweenInstruction_1.default(Object.assign({ to, from }, rest, { options: extendedOptions }));
    }
    tween(startValue, options) {
        const extendedOptions = this.options.extend(options);
        return new Tween_1.Tween(startValue, extendedOptions);
    }
}
TweenSugar.default = new TweenSugar(settings_1.defaultOptions);
exports.TweenSugar = TweenSugar;
