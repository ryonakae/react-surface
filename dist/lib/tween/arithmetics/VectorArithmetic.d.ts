import { IArithmetic } from './IArithmetic';
export declare class VectorArithmetic implements IArithmetic<number[]> {
    single: number[];
    zero: number[];
    add(v1: number[], v2: number[]): number[];
    subtract(v1: number[], v2: number[]): number[];
    multiply(v: number[], factor: number): number[];
    maxDivide(v1: number[], v2: number[]): number;
    scalarDivide(v: number[], divisor: number): number[];
    equals(v1: number[], v2: number[]): boolean;
    abs(v: number[]): number[];
    test(value: any): boolean;
    parse(value: number[]): number[];
}
