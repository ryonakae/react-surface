import { BezierEasing } from './BezierEasing';
declare class TweenOptionsProps {
    easing: BezierEasing;
    delay: number;
    duration: number;
    protected props: Partial<TweenOptionsProps>;
    constructor(props?: Partial<TweenOptionsProps>);
}
export declare class TweenOptions extends TweenOptionsProps {
    extend(ext?: Partial<TweenOptionsProps>): TweenOptions;
    equals(other: TweenOptions): boolean;
}
export {};
