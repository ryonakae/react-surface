import { TweenOptions } from './TweenOptions';
import TweenInstruction, { TweenInstructionProps } from './TweenInstruction';
import { Tween } from './Tween';
export declare class TweenSugar {
    options: TweenOptions;
    constructor(options: TweenOptions);
    toggle<TValue>(offValue: TValue, onValue: TValue, isOn: boolean, options?: TweenOptions): TweenInstruction<TValue>;
    to<TValue>(to: TValue, props?: Partial<TweenInstructionProps<TValue>>): TweenInstruction<TValue>;
    from<TValue>(from: TValue, props?: Partial<TweenInstructionProps<TValue>>): TweenInstruction<TValue>;
    transition<TValue>(from: TValue, to: TValue, props?: Partial<TweenInstructionProps<TValue>>): TweenInstruction<TValue>;
    tween<TValue>(startValue: TValue, options?: TweenOptions): Tween<TValue>;
    static default: TweenSugar;
}
