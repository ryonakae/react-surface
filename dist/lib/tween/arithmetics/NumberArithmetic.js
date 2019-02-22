"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NumberArithmetic {
    constructor() {
        this.single = 1;
        this.zero = 0;
    }
    add(a, b) {
        return a + b;
    }
    subtract(a, b) {
        return a - b;
    }
    multiply(a, b) {
        return a * b;
    }
    maxDivide(a, b) {
        return a / b;
    }
    scalarDivide(a, b) {
        return a / b;
    }
    equals(a, b) {
        return a === b;
    }
    abs(a) {
        return Math.abs(a);
    }
    test(value) {
        return typeof value === 'number';
    }
    parse(value) {
        return value;
    }
}
exports.NumberArithmetic = NumberArithmetic;
