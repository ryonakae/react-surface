import * as React from 'react';
import {fonts} from './assets/fonts';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react/custom';
import {Box} from './Box';
import * as PropTypes from 'prop-types';
import {SurfaceStyleSheet} from '../../src/lib/SurfaceStyleSheet';
import * as Color from 'color';

const sizes = [
  'cover',
  'contain',
  '50%',
  '100%',
  ['50%', '100%'],
  ['100%', '50%']
];

const positions = [
  ['50%', '50%'],
  [0, 0],
  [50, 0],
  [0, 50],
  [50, 50],
  ['0%', '100%'],
  ['100%', '0%'],
  ['75%', '25%'],
  ['25%', '75%']
];

@observer
export class App extends React.Component {
  @observable isBoxVisible = true;
  @observable isAlternate = false;
  @observable sizeIndex = sizes.length;
  @observable positionIndex = positions.length;

  private keyUpEventHandler: any;

  static childContextTypes = {
    foo: PropTypes.string
  };

  getChildContext () {
    return {
      foo: this.isAlternate ?
        'Alternate context from App' :
        'Regular context from app'
    };
  }

  componentWillMount () {
    this.keyUpEventHandler = this.onKeyUp.bind(this);
    window.addEventListener('keyup', this.keyUpEventHandler);
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.keyUpEventHandler);
  }

  render () {
    const throwAway = this.isAlternate; // tslint:disable-line
    return (
      <surface style={styles.app}>
        <surface style={styles.backLayer}/>
        <Box
          size={sizes[this.sizeIndex % sizes.length]}
          position={positions[this.positionIndex % positions.length]}
        />
      </surface>
    );
  }

  @action
  onKeyUp (e: KeyboardEvent) {
    switch (e.key) {
      case 'Backspace':
        this.isAlternate = !this.isAlternate;
        e.preventDefault();
        break;
      case '+':
        if (e.shiftKey) {
          this.sizeIndex += 1;
        } else {
          this.positionIndex += 1;
        }
        break;
      case '-':
        if (e.shiftKey) {
          this.sizeIndex -= 1;
        } else {
          this.positionIndex -= 1;
        }
        break;
    }
  }
}

const styles = SurfaceStyleSheet.create({
  app: {
    width: 700,
    height: 500,
    backgroundColor: Color.rgb('#102030'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    text: {
      fill: Color.rgb('#ffffff').rgbNumber(),
      fontSize: 14,
      fontFamily: fonts.Default
    }
  },

  backLayer: {
    backgroundColor: Color.rgb('#5498c4').alpha(0.5),
    position: 'absolute',
    top: 10, right: 10, bottom: 10, left: 10
  },

  frontLayer: {
    backgroundColor: Color.rgb('#629c36').alpha(0.5),
    position: 'absolute',
    top: 35, right: 35, bottom: 35, left: 35
  }
});
