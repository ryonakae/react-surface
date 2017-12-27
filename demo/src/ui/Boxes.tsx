import * as React from 'react';
import {Box} from './Box';
import * as Color from 'color';

export class Boxes extends React.Component {
  render () {
    return tests.map((properties, index) => (
      <Box key={index} properties={properties}/>
    ));
  }
}

const tests = [
  [{name: 'backgroundColor', off: Color.rgb('#ff0000'), on: Color.rgb('#00ff00')}],
  [{name: 'width', off: 100, on: 120}],
  [{name: 'height', off: 100, on: 120}],
  [{name: 'margin', off: 0, on: 10}],
  [{name: 'flex', off: 0.01, on: 1}],
  [{name: 'padding', off: 0, on: 10}],
  [{name: 'top', off: 0, on: 20}],
  [{name: 'right', off: 0, on: 20}],
  [{name: 'bottom', off: 0, on: 20}],
  [{name: 'left', off: 0, on: 20}],
  [{name: 'border', off: 0, on: 20}],
  [{name: 'borderRadius', off: 0, on: 50}],
  [{name: 'borderColor', off: Color.rgb('#ff0000'), on: Color.rgb('#0000ff')}],
  [{name: 'rotation', off: 0, on: Math.PI}],
  [{name: 'skewX', off: 0, on: Math.PI}],
  [{name: 'skewY', off: 0, on: Math.PI}],
  [{name: 'translateX', off: 0, on: 25}],
  [{name: 'translateY', off: 0, on: 25}],
  [{name: 'scaleX', off: 1, on: 0.5}],
  [{name: 'scaleY', off: 1, on: 0.5}],
  [{name: 'minWidth', off: 0, on: 300}],
  [{name: 'minHeight', off: 0, on: 300}],
  [{name: 'maxWidth', off: 0, on: 150}],
  [{name: 'maxHeight', off: 0, on: 150}],
];
