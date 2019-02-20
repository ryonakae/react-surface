import {getArithmetic, defaultOptions} from './settings';
import {TweenOptions} from './TweenOptions';
import TweenInstruction, {TweenInstructionProps} from './TweenInstruction';
import {TweenSugar} from './TweenSugar';
const TWEEN = require('tween.js');

let idCounter = 0;

export class Tween<TValue> {
  public readonly id = idCounter += 1;

  private internalTween?: TWEEN.Tween;
  private resolvers: Array<(value: TValue) => void> = [];

  lastInstruction!: TweenInstruction<TValue>;

  constructor (
    public value: TValue,
    public options: TweenOptions = defaultOptions
  ) {}

  // TODO make sure arithmetic isn't changed
  get arithmetic () {
    return getArithmetic(this.value);
  }

  private onTweenCompleted () {
    delete (this.internalTween as any).__owner;
    delete this.internalTween;
    while (this.resolvers.length) {
      this.resolvers.pop()!(this.value);
    }
  }

  stop () {
    if (this.internalTween) {
      this.internalTween.stop();
      delete this.internalTween;
    }
  }

  instruct (inst: TweenInstruction<TValue>) {
    this.lastInstruction = inst;

    // Merge tween options with expression options
    inst = inst.extend({options: this.options.extend(inst.options)});

    this.stop();

    if (inst.from !== undefined) {
      this.value = inst.from;
    }

    return new Promise<TValue>((resolve) => {
      this.resolvers.push(resolve);

      let duration = inst.options!.duration;

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
      this.internalTween = new TWEEN.Tween(tweenTarget);
      (this.internalTween as any).__owner = this;

      const startValue = this.value;
      const delta = this.arithmetic.subtract(inst.to, startValue);

      this.internalTween!
        .easing(inst.options!.easing.get.bind(inst.options!.easing))
        .delay(inst.options!.delay)
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
    return this.instruct(TweenSugar.default.toggle(offValue, onValue, isOn, options));
  }

  to (to: TValue, props: Partial<TweenInstructionProps<TValue>> = {}) {
    return this.instruct(TweenSugar.default.to(to, props));
  }

  from (from: TValue, props: Partial<TweenInstructionProps<TValue>> = {}) {
    return this.instruct(TweenSugar.default.from(from, props));
  }

  transition (from: TValue, to: TValue, props: Partial<TweenInstructionProps<TValue>> = {}) {
    return this.instruct(TweenSugar.default.transition(from, to, props));
  }

  static update (): Tween<any>[] {
    TWEEN.update();
    return TWEEN.getAll().map(
      (internalTween: TWEEN.Tween) => (internalTween as any).__owner
    );
  }
}
