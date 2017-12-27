import {TweenOptions} from './TweenOptions';
import {BezierEasing} from './BezierEasing';
import {NumberArithmetic} from './arithmetics/NumberArithmetic';
import {ColorArithmetic} from './arithmetics/ColorArithmetic';
import {VectorArithmetic} from './arithmetics/VectorArithmetic';
import {IArithmetic} from './arithmetics/IArithmetic';

export const defaultOptions = new TweenOptions({
  duration: (24 / 60) * 1000,
  easing: BezierEasing.presets.easeOut
});

export const arithmetics: IArithmetic<{}>[] = [
  new NumberArithmetic(),
  new ColorArithmetic(),
  new VectorArithmetic()
];

export function getArithmetic<TValue> (value: TValue): IArithmetic<TValue> {
  for (const arm of arithmetics) {
    if (arm.test(value)) {
      return arm as IArithmetic<TValue>;
    }
  }

  throw new Error('No arithmetic available for value');
}
