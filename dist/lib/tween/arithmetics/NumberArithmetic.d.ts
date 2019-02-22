import { IArithmetic } from './IArithmetic';
export declare class NumberArithmetic implements IArithmetic<number> {
    single: number;
    zero: number;
    add(a: number, b: number): number;
    subtract(a: number, b: number): number;
    multiply(a: number, b: number): number;
    maxDivide(a: number, b: number): number;
    scalarDivide(a: number, b: number): number;
    equals(a: number, b: number): boolean;
    abs(a: number): number;
    test(value: any): boolean;
    parse(value: number): number;
}
