import { IArithmetic } from './IArithmetic';
import * as Color from 'color';
export declare class ColorArithmetic implements IArithmetic<Color> {
    single: Color;
    zero: Color;
    private vectorArithmetic;
    add(c1: Color, c2: Color): Color;
    subtract(c1: Color, c2: Color): Color;
    multiply(c: Color, factor: number): Color;
    maxDivide(c: Color, divisor: Color): number;
    scalarDivide(c: Color, divisor: number): Color;
    equals(c1: Color, c2: Color): boolean;
    abs(c: Color): Color;
    test(value: any): boolean;
    parse(value: any): Color;
    private piggyback;
}
