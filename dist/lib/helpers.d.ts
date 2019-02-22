import { Tween } from './tween/Tween';
export declare function definedOr<T>(value: T, fallbackValue?: T): T;
export declare type TweenableProps<T> = {
    [P in keyof T]: Tween<T[P]>;
};
export declare type GettableProps<T> = {
    [P in keyof T]: () => T[P];
};
