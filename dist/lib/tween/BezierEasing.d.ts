export declare class BezierEasing {
    static presets: {
        ease: BezierEasing;
        linear: BezierEasing;
        easeIn: BezierEasing;
        easeOut: BezierEasing;
        easeInOut: BezierEasing;
        standard: BezierEasing;
    };
    private points;
    get: (t: number) => number;
    constructor(...points: number[]);
    equals(other: BezierEasing): boolean;
}
