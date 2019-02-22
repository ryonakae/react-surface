"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TweenOptions_1 = require("./TweenOptions");
const BezierEasing_1 = require("./BezierEasing");
const NumberArithmetic_1 = require("./arithmetics/NumberArithmetic");
const ColorArithmetic_1 = require("./arithmetics/ColorArithmetic");
const VectorArithmetic_1 = require("./arithmetics/VectorArithmetic");
exports.defaultOptions = new TweenOptions_1.TweenOptions({
    duration: (24 / 60) * 1000,
    easing: BezierEasing_1.BezierEasing.presets.easeOut
});
exports.arithmetics = [
    new NumberArithmetic_1.NumberArithmetic(),
    new ColorArithmetic_1.ColorArithmetic(),
    new VectorArithmetic_1.VectorArithmetic()
];
function getArithmetic(value) {
    for (const arm of exports.arithmetics) {
        if (arm.test(value)) {
            return arm;
        }
    }
    throw new Error('No arithmetic available for value');
}
exports.getArithmetic = getArithmetic;
