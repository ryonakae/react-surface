import {BezierEasing} from '../../../src/lib/tween/BezierEasing';
import {TweenOptions} from '../../../src/lib/tween/TweenOptions';
import {defaultOptions} from '../../../src/lib/tween/settings';
import {TweenSugar} from '../../../src/lib/tween/TweenSugar';

export const tweenSugar = {
  bounce: new TweenSugar(new TweenOptions({duration: 400, easing: new BezierEasing(0, -0.01, .2, 1.64)})),
  press: new TweenSugar(new TweenOptions({duration: 100, easing: BezierEasing.presets.easeOut})),
  focus: new TweenSugar(new TweenOptions({duration: (12 / 60) * 1000, easing: BezierEasing.presets.easeOut})),
  spring: new TweenSugar(new TweenOptions({duration: 300, easing: new BezierEasing(0.215, 0.61, 0.355, 1)})),
  navigation: new TweenSugar(defaultOptions.extend({duration: 48 / 60, easing: BezierEasing.presets.standard}))
};
