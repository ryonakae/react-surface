import * as React from 'react';
import {fonts} from './assets/fonts';
import {observable} from 'mobx';
import {observer} from 'mobx-react/custom';
import {Box} from './Box';
import * as PropTypes from 'prop-types';
import {range} from 'lodash';

@observer
export class App extends React.Component<{log: boolean}> {
  @observable isBoxVisible = true;
  @observable isAlternate = false;
  @observable boxCount = 1;

  private keyUpEventHandler: any;
  private node: ISurface;

  static childContextTypes = {
    foo: PropTypes.string,
    log: PropTypes.bool
  };

  getChildContext () {
    return {
      log: this.props.log,
      foo: this.isAlternate ?
        'Alternate context from App' :
        'Regular context from app'
    };
  }

  componentWillMount () {
    if (this.props.log) {
      console.log('App will mount');
    }

    this.keyUpEventHandler = this.onKeyUp.bind(this);
    window.addEventListener('keyup', this.keyUpEventHandler);
  }

  componentWillUpdate () {
    if (this.props.log) {
      console.log('App will update');
    }
  }

  componentDidUpdate () {
    if (this.props.log) {
      console.log('App did update');
    }
  }

  componentDidMount () {
    if (this.props.log) {
      console.log('App did mount');
    }
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.keyUpEventHandler);
    if (this.props.log) {
      console.log('App unmounted');
    }
  }

  render () {
    const throwAway = this.isAlternate;
    return (
      <surface ref={(node: any) => this.node = node} style={styles.app}>
        {range(0, this.boxCount).map((number) => <Box key={number}/>)}
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


const styles: any = {
  app: {
    flex: 1,
    padding: '20vw 20vw',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontFamily: fonts.Default
  }
};
