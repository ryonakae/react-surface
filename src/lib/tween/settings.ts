import {TweenOptions} from './TweenOptions';
import {BezierEasing} from './BezierEasing';
import {NumberArithmetic} from './arithmetics/NumberArithmetic';
import {ColorArithmetic} from './arithmetics/ColorArithmetic';
import {VectorArithmetic} from './arithmetics/VectorArithmetic';
import {IArithmetic} from './arithmetics/IArithmetic';

const defaultOptions = new TweenOptions({
  duration: (24 / 60) * 1000,
  easing: BezierEasing.presets.easeOut
});

export const durationFactor = 1;

export const presets = {
  default: defaultOptions,
  bounce: new TweenOptions({duration: 400, easing: new BezierEasing(0, -0.01, .2, 1.64)}),
  press: new TweenOptions({duration: 100, easing: BezierEasing.presets.easeOut}),
  focus: new TweenOptions({duration: (12 / 60) * 1000, easing: BezierEasing.presets.easeOut}),
  spring: new TweenOptions({duration: 300, easing: new BezierEasing(0.215, 0.61, 0.355, 1)}),
  navigation: defaultOptions.extend({duration: 48 / 60, easing: BezierEasing.presets.standard})
};

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
