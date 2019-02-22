import { TweenOptions } from './TweenOptions';
import TweenInstruction, { TweenInstructionProps } from './TweenInstruction';
export declare class Tween<TValue> {
    value: TValue;
    options: TweenOptions;
    readonly id: number;
    private internalTween?;
    private resolvers;
    lastInstruction: TweenInstruction<TValue>;
    constructor(value: TValue, options?: TweenOptions);
    readonly arithmetic: import("./arithmetics/IArithmetic").IArithmetic<TValue>;
    private onTweenCompleted;
    stop(): void;
    instruct(inst: TweenInstruction<TValue>): Promise<TValue>;
    set(value: TValue): void;
    toggle(offValue: TValue, onValue: TValue, isOn: boolean, options?: TweenOptions): Promise<TValue>;
    to(to: TValue, props?: Partial<TweenInstructionProps<TValue>>): Promise<TValue>;
    from(from: TValue, props?: Partial<TweenInstructionProps<TValue>>): Promise<TValue>;
    transition(from: TValue, to: TValue, props?: Partial<TweenInstructionProps<TValue>>): Promise<TValue>;
    static update(): Tween<any>[];
}
