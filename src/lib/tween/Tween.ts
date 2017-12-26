import {presets, getArithmetic} from './settings';
import {TweenOptions} from './TweenOptions';
import TweenInstruction, {TweenInstructionProps} from './TweenInstruction';
const TWEEN = require('tween.js');

export class Tween<TValue> {
  private tween?: TWEEN.Tween;
  private resolvers: Array<(value: TValue) => void> = [];

  constructor (
    public value: TValue, 
    public options: TweenOptions = presets.default
  ) {}
  
  // TODO make sure arithmetic isn't changed
  get arithmetic () {
    return getArithmetic(this.value);
  }

  private onTweenCompleted () {
    delete this.tween;
    while (this.resolvers.length) {
      this.resolvers.pop()(this.value);
    }
  }

  instruct (inst: TweenInstruction<TValue>) {
    // Merge tween options with expression options
    inst = inst.extend({options: this.options.extend(inst.options)});

    if (this.tween) {
      this.tween.stop();
    }

    if (inst.from !== undefined) {
      this.value = inst.from;
    }

    return new Promise<TValue>((resolve) => {
      this.resolvers.push(resolve);

      let duration = inst.options.duration;

      if (inst.speed !== undefined) {
        const delta = this.arithmetic.abs(
          this.arithmetic.subtract(inst.to, this.value)
        );
        const numberOfFrames = this.arithmetic.maxDivide(delta, inst.speed);
        duration = 16 * numberOfFrames;
      }

      if (duration === undefined) {
        throw new Error('Either speed or duration must be configured for tween instructions');
      }

      const tweenTarget = {progress: 0};
      this.tween = new TWEEN.Tween(tweenTarget);

      const startValue = this.value;
      const delta = this.arithmetic.subtract(inst.to, startValue);

      this.tween
        .easing(inst.options.easing.get.bind(inst.options.easing))
        .delay(inst.options.delay)
        .to({progress: 1}, duration)
        .onUpdate(() => {
          this.value = this.arithmetic.parse(
            this.arithmetic.add(
              startValue,
              this.arithmetic.multiply(delta, tweenTarget.progress)
            )
          );
        })
        .onComplete(this.onTweenCompleted.bind(this))
        .start();
    });
  }

  // Syntax sugar for common tween instructions

  set (value: TValue) {
    this.value = value;
  }

  toggle (offValue: TValue, onValue: TValue, isOn: boolean, options?: TweenOptions) {
    return this.instruct(Tween.toggle(offValue, onValue, isOn, options));
  }

  to (to: TValue, props: Partial<TweenInstructionProps<TValue>> = {}) {
    return this.instruct(new TweenInstruction({to, ...props}));
  }

  from (from: TValue, props: Partial<TweenInstructionProps<TValue>> = {}) {
    return this.instruct(new TweenInstruction({from, ...props}));
  }

  transition (from: TValue, to: TValue, props: Partial<TweenInstructionProps<TValue>> = {}) {
    return this.instruct(new TweenInstruction({from, to, ...props}));
  }


  // Syntax sugar for common tween expressions

  static toggle<TValue> (offValue: TValue, onValue: TValue, isOn: boolean, options?: TweenOptions) {
    options = presets.default.extend(options);

    const arithmetic = getArithmetic(offValue);
    const toValue = isOn ? onValue : offValue;

    if (arithmetic.equals(offValue, onValue)) {
      // Optimise redundant toggles without breaking API (they're mostly misconfigurations)
      return Tween.to(toValue, options.extend({duration: 0}));
    }

    // For relevant toggles we need to calculate a speed
    const numberOfFrames = options.duration / 16;
    const delta = arithmetic.abs(arithmetic.subtract(onValue, offValue));
    const speed = arithmetic.scalarDivide(delta, numberOfFrames);
    return new TweenInstruction({speed, options, to: toValue});
  }

  static to<TValue> (to: TValue, options?: TweenOptions) {
    return new TweenInstruction({to, options});
  }

  static from<TValue> (from: TValue, options?: TweenOptions) {
    return new TweenInstruction({from, options});
  }

  static transition<TValue> (from: TValue, to: TValue, options?: TweenOptions) {
    return new TweenInstruction({from, to, options});
  }

  static update () {
    TWEEN.update();
  }
}
