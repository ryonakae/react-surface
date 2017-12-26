import {Tween} from './tween/Tween';

export function definedOr<T> (value: T, fallbackValue?: T) {
  return value !== undefined ? value : fallbackValue;
}

export type TweenableProps<T> = {
  [P in keyof T]: Tween<T[P]>;
};
