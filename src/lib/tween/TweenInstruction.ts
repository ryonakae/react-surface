import {TweenOptions} from './TweenOptions';
import {getArithmetic} from './settings';

export class TweenInstructionProps<TValue> {
  from: TValue;
  to: TValue;
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
}
