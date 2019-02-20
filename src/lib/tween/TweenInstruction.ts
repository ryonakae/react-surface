import {TweenOptions} from './TweenOptions';
import {getArithmetic} from './settings';

export class TweenInstructionProps<TValue> {
  from!: TValue;
  to!: TValue;
  speed?: TValue;
  options?: TweenOptions;

  protected props: Partial<TweenInstructionProps<TValue>>;

  constructor (props: Partial<TweenInstructionProps<TValue>> = {}) {
    Object.assign(this, props);
    this.props = props;
  }
}

export default class TweenInstruction<TValue> extends TweenInstructionProps<TValue> {
  get arithmetic () {
    return getArithmetic(this.props.to || this.props.from);
  }

  extend (ext: Partial<TweenInstructionProps<TValue>>) {
    const {options, ...props} = ext;
    const extended = new TweenInstruction({...this.props, ...props});
    extended.options = this.options ? this.options.extend(options) : options;
    return extended;
  }

  equals (other: TweenInstruction<TValue>) {
    if (!other) {
      return false;
    }

    if (this.options && other.options) {
      if (!this.options.equals(other.options)) {
        return false;
      }
    } else if (this.options || other.options) {
      return false;
    }

    return this.from === other.from &&
      this.to === other.to &&
      this.speed === other.speed;
  }
}
