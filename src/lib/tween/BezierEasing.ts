const bezier = require('bezier');

export class BezierEasing {
  static presets = {
    ease: new BezierEasing(0.25, 0.1, 0.25, 1.0),
    linear: new BezierEasing(0.00, 0.0, 1.00, 1.0),
    easeIn: new BezierEasing(0.42, 0.0, 1.00, 1.0),
    easeOut: new BezierEasing(0.00, 0.0, 0.58, 1.0),
    easeInOut: new BezierEasing(0.42, 0.0, 0.58, 1.0),
    standard: new BezierEasing(0.4, 0.0, 0.2, 1) // Google motion standard
  };

  private points: number[];
  constructor (...points: number[]) {
    this.points = points;
  }

  equals (other: BezierEasing) {
    if (other.points.length !== this.points.length) {
      return false;
    }
    for (let i = 0; i < this.points.length; i += 1) {
      if (this.points[i] !== other.points[i]) {
        return false;
      }
    }
    return true;
  }

  get (x: number) {
    return bezier(this.points, x);
  }
}
