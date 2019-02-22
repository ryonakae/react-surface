import { TweenOptions } from './TweenOptions';
import { IArithmetic } from './arithmetics/IArithmetic';
export declare const defaultOptions: TweenOptions;
export declare const arithmetics: IArithmetic<{}>[];
export declare function getArithmetic<TValue>(value: TValue): IArithmetic<TValue>;
