import {IArithmetic} from './IArithmetic';
import * as Color from 'color';
import {VectorArithmetic} from './VectorArithmetic';

export class ColorArithmetic implements IArithmetic<Color> {
  single = Color.rgb(1, 1, 1);
  zero = Color.rgb(0, 0, 0);

  private vectorArithmetic = new VectorArithmetic();

  add (c1: Color, c2: Color): Color {
    return this.piggyback('add', [c1, c2]);
  }

  subtract (c1: Color, c2: Color): Color {
    return this.piggyback('subtract', [c1, c2]);
  }

  multiply (c: Color, factor: number): Color {
    return this.piggyback('multiply', [c, factor]);
  }

  maxDivide (c: Color, divisor: Color): number {
    return this.piggyback('maxDivide', [c, divisor]);
  }

  scalarDivide (c: Color, divisor: number): Color {
    return this.piggyback('scalarDivide', [c, divisor]);
  }

  equals (c1: Color, c2: Color): boolean {
    return this.piggyback('equals', [c1, c2]);
  }

  magnitude (c: Color): number {
    return this.piggyback('magnitude', [c]);
  }

  abs (c: Color): Color {
    return this.piggyback('abs', [c]);
  }

  test (value: any): boolean {
    return value instanceof Color;
  }

  private piggyback (functionName: string, args: any[]) {
    const convertedArgs = args.map((arg) =>
      arg instanceof Color ? colorToVector(arg) : arg
    );
    const res = (this.vectorArithmetic as any)[functionName](...convertedArgs);
    if (Array.isArray(res)) {
      return new Color(res.slice(0, 3)).alpha(res[3]);
    }
    return res;
  }
}

function colorToVector (c: Color): number[] {
  return [c.red(), c.green(), c.blue(), c.alpha()];
}
