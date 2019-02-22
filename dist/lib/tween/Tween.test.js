"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tween_1 = require("./Tween");
const settings_1 = require("./settings");
const NumberArithmetic_1 = require("./arithmetics/NumberArithmetic");
const ColorArithmetic_1 = require("./arithmetics/ColorArithmetic");
const VectorArithmetic_1 = require("./arithmetics/VectorArithmetic");
describe('Tween', () => {
    let keepTicking = false;
    const originalDefaultDuration = settings_1.defaultOptions.duration;
    function tick() {
        Tween_1.Tween.update();
        if (keepTicking) {
            setTimeout(tick, 16);
        }
    }
    beforeEach(() => {
        settings_1.defaultOptions.duration = 100;
        keepTicking = true;
        tick();
    });
    afterEach(() => {
        settings_1.defaultOptions.duration = originalDefaultDuration;
        keepTicking = false;
    });
    describe('NumberArithmetic', () => {
        testArithmetic(new NumberArithmetic_1.NumberArithmetic());
    });
    describe('VectorArithmetic', () => {
        testArithmetic(new VectorArithmetic_1.VectorArithmetic());
    });
    describe('ColorArithmetic', () => {
        testArithmetic(new ColorArithmetic_1.ColorArithmetic());
    });
});
function testArithmetic(arithmetic) {
    const expectArithmeticEqual = (a, b) => (expect(arithmetic.equals(a, b)).toBe(true));
    it('can set tween value manually', () => {
        const tween = new Tween_1.Tween(arithmetic.zero);
        tween.set(arithmetic.single);
        expectArithmeticEqual(tween.value, arithmetic.single);
    });
    it('can tween positively with duration', async () => {
        const tween = new Tween_1.Tween(arithmetic.zero);
        const target = arithmetic.multiply(arithmetic.single, 25);
        await expectDuration(tween.to(target), tween.options.duration);
    });
    it('can tween positively with speed', async () => {
        const tween = new Tween_1.Tween(arithmetic.zero);
        const target = arithmetic.multiply(arithmetic.single, 25);
        await expectDuration(tween.to(target, { speed: arithmetic.single }), 16 * 25);
    });
    it('can tween negatively with duration', async () => {
        const tween = new Tween_1.Tween(arithmetic.zero);
        const target = arithmetic.multiply(arithmetic.single, -25);
        await expectDuration(tween.to(target), tween.options.duration);
    });
    it('can tween negatively with speed', async () => {
        const tween = new Tween_1.Tween(arithmetic.zero);
        const target = arithmetic.multiply(arithmetic.single, -25);
        await expectDuration(tween.to(target, { speed: arithmetic.single }), 16 * 25);
    });
    it('toggle yields the correct end value', async () => {
        const tween = new Tween_1.Tween(arithmetic.zero);
        const offValue = arithmetic.multiply(arithmetic.single, 5);
        const onValue = arithmetic.multiply(arithmetic.single, 10);
        let endValue = await tween.toggle(offValue, onValue, true);
        expectArithmeticEqual(endValue, onValue);
        endValue = await tween.toggle(offValue, onValue, false);
        expectArithmeticEqual(endValue, offValue);
    });
    it('promise resolves with end value', async () => {
        const tween = new Tween_1.Tween(arithmetic.zero);
        const target = arithmetic.multiply(arithmetic.single, 5);
        const endValue = await tween.to(target);
        expectArithmeticEqual(endValue, target);
    });
    it('can override instruction', async () => {
        const tween = new Tween_1.Tween(arithmetic.zero);
        const target1 = arithmetic.multiply(arithmetic.single, 5);
        const target2 = arithmetic.multiply(arithmetic.single, 10);
        setTimeout(() => tween.to(target2), tween.options.duration / 2);
        await tween.to(target1);
        expectArithmeticEqual(tween.value, target2);
    });
    it('overridden instructions add to duration', async () => {
        const tween = new Tween_1.Tween(arithmetic.zero);
        const target1 = arithmetic.multiply(arithmetic.single, 5);
        const target2 = arithmetic.multiply(arithmetic.single, 10);
        setTimeout(() => tween.to(target2), tween.options.duration / 2);
        await expectDuration(tween.to(target1), tween.options.duration * 1.5);
    });
}
async function expectDuration(promise, duration) {
    const start = new Date().getTime();
    await promise;
    const timeSpent = (new Date().getTime() - start);
    expect(timeSpent).toBeGreaterThanOrEqual(duration - 16);
    expect(timeSpent).toBeLessThan(duration + 32);
}
