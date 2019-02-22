import { TweenOptions } from './TweenOptions';
export declare class TweenInstructionProps<TValue> {
    from: TValue;
    to: TValue;
    speed?: TValue;
    options?: TweenOptions;
    protected props: Partial<TweenInstructionProps<TValue>>;
    constructor(props?: Partial<TweenInstructionProps<TValue>>);
}
export default class TweenInstruction<TValue> extends TweenInstructionProps<TValue> {
    readonly arithmetic: import("./arithmetics/IArithmetic").IArithmetic<TValue>;
    extend(ext: Partial<TweenInstructionProps<TValue>>): TweenInstruction<TValue>;
    equals(other: TweenInstruction<TValue>): boolean;
}
