"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VectorArithmetic {
    constructor() {
        this.single = [1, 1];
        this.zero = [0, 0];
    }
    add(v1, v2) {
        const length = Math.max(v1.length, v2.length);
        const sum = [];
        for (let i = 0; i < length; i += 1) {
            sum[i] = (v1[i] || 0) + (v2[i] || 0);
        }
        return sum;
    }
    subtract(v1, v2) {
        const length = Math.max(v1.length, v2.length);
        const sum = [];
        for (let i = 0; i < length; i += 1) {
            sum[i] = (v1[i] || 0) - (v2[i] || 0);
        }
        return sum;
    }
    multiply(v, factor) {
        const scaled = [];
        for (let i = 0; i < v.length; i += 1) {
            scaled[i] = v[i] * factor;
        }
        return scaled;
    }
    maxDivide(v1, v2) {
        const length = Math.max(v1.length, v2.length);
        let max = 0;
        for (let i = 0; i < length; i += 1) {
            const quotient = (v1[i] || 0) / (v2[i] || 0);
            if (Math.abs(quotient) > Math.abs(max)) {
                max = quotient;
            }
        }
        return max;
    }
    scalarDivide(v, divisor) {
        const divided = [];
        for (let i = 0; i < v.length; i += 1) {
            divided[i] = v[i] / divisor;
        }
        return divided;
    }
    equals(v1, v2) {
        if (v1.length !== v2.length) {
            return false;
        }
        for (let i = 0; i < v1.length; i += 1) {
            if (v1[i] !== v2[i]) {
                return false;
            }
        }
        return true;
    }
    abs(v) {
        return v.map((e) => Math.abs(e));
    }
    test(value) {
        return Array.isArray(value);
    }
    parse(value) {
        return value;
    }
}
exports.VectorArithmetic = VectorArithmetic;
