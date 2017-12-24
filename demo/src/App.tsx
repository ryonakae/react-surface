import * as React from 'react';
import {fonts} from './assets/fonts';
import {observable} from 'mobx';
import {observer} from 'mobx-react/custom';
import {Box} from './Box';
import * as PropTypes from 'prop-types';
import {range} from 'lodash';
import {SurfaceStyleSheet} from '../../src/lib/SurfaceStyleSheet';
import * as Color from 'color';

@observer
export class App extends React.Component {
  @observable isBoxVisible = true;
  @observable isAlternate = false;
  @observable boxCount = 1;

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
        {range(0, this.boxCount).map((number) => <Box key={number}/>)}
        <surface style={styles.frontLayer}/>
      </surface>
    );
  }

  onKeyUp (e: KeyboardEvent) {
    switch (e.key) {
      case 'Backspace':
        this.isAlternate = !this.isAlternate;
        e.preventDefault();
        break;
      case '+':
        this.boxCount += 1;
        break;
      case '-':
        this.boxCount -= 1;
        if (this.boxCount < 0) {
          this.boxCount = 0;
        }
        break;
    }
  }
}

const styles = SurfaceStyleSheet.create({
  app: {
    width: 500,
    height: 300,
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
