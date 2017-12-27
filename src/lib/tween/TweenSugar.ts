import {TweenOptions} from './TweenOptions';
import {getArithmetic} from './settings';
import TweenInstruction, {TweenInstructionProps} from './TweenInstruction';

export class TweenSugar {
  constructor (
    public options: TweenOptions
  ) {}

  toggle<TValue> (offValue: TValue, onValue: TValue, isOn: boolean, options?: TweenOptions) {
    options = this.options.extend(options);

    const arithmetic = getArithmetic(offValue);
    const toValue = isOn ? onValue : offValue;

    if (arithmetic.equals(offValue, onValue)) {
      // Optimise redundant toggles without breaking API (they're mostly misconfigurations)
      return this.to(toValue, {options: options.extend({duration: 0})});
    }

    // For relevant toggles we need to calculate a speed
    const numberOfFrames = options.duration / 16;
    const delta = arithmetic.abs(arithmetic.subtract(onValue, offValue));
    const speed = arithmetic.scalarDivide(delta, numberOfFrames);

    return new TweenInstruction({speed, options, to: toValue});
  }

  to<TValue> (to: TValue, props: Partial<TweenInstructionProps<TValue>> = {}) {
    const {options, ...rest} = props;
    const extendedOptions = this.options.extend(options);
    return new TweenInstruction({to, ...rest, options: extendedOptions});
  }

  from<TValue> (from: TValue, props: Partial<TweenInstructionProps<TValue>> = {}) {
    const {options, ...rest} = props;
    const extendedOptions = this.options.extend(options);
    return new TweenInstruction({from, ...rest, options: extendedOptions});
  }

  transition<TValue> (from: TValue, to: TValue, props: Partial<TweenInstructionProps<TValue>> = {}) {
    const {options, ...rest} = props;
    const extendedOptions = this.options.extend(options);
    return new TweenInstruction({to, from, ...rest, options: extendedOptions});
  }
}
