"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Color = require("color");
const VectorArithmetic_1 = require("./VectorArithmetic");
class ColorArithmetic {
    constructor() {
        this.single = Color.rgb(1, 1, 1);
        this.zero = Color.rgb(0, 0, 0);
        this.vectorArithmetic = new VectorArithmetic_1.VectorArithmetic();
    }
    add(c1, c2) {
        return this.piggyback('add', [c1, c2]);
    }
    subtract(c1, c2) {
        return this.piggyback('subtract', [c1, c2]);
    }
    multiply(c, factor) {
        return this.piggyback('multiply', [c, factor]);
    }
    maxDivide(c, divisor) {
        return this.piggyback('maxDivide', [c, divisor]);
    }
    scalarDivide(c, divisor) {
        return this.piggyback('scalarDivide', [c, divisor]);
    }
    equals(c1, c2) {
        return this.piggyback('equals', [c1, c2]);
    }
    abs(c) {
        return this.piggyback('abs', [c]);
    }
    test(value) {
        return value instanceof Color;
    }
    parse(value) {
        return new Color(value);
    }
    piggyback(functionName, args) {
        const convertedArgs = args.map((arg) => arg instanceof Color ? colorToVector(arg) : arg);
        const res = this.vectorArithmetic[functionName](...convertedArgs);
        if (Array.isArray(res)) {
            res[3] = cap(res[3], 0, 1);
        }
        return res;
    }
}
exports.ColorArithmetic = ColorArithmetic;
function colorToVector(c) {
    return [c.red(), c.green(), c.blue(), c.alpha()];
}
function cap(v, min, max) {
    if (v < min) {
        return min;
    }
    if (v > max) {
        return max;
    }
    return v;
}
