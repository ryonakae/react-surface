import * as React from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react/custom';
import * as PropTypes from 'prop-types';

@observer
export class Box extends React.Component {
  @observable isAlternate = true;
  private keyUpEventHandler: any;

  static contextTypes = {
    foo: PropTypes.string,
    log: PropTypes.bool
  };

  shouldComponentUpdate () {
    return true;
  }

  componentWillMount () {
    if (this.context.log) {
      console.log('Box will mount');
    }

    this.keyUpEventHandler = this.onKeyUp.bind(this);
    window.addEventListener('keyup', this.keyUpEventHandler);
  }

  componentWillUpdate () {
    if (this.context.log) {
      console.log('Box will update');
    }
  }

  componentDidUpdate () {
    if (this.context.log) {
      console.log('Box did update');
    }
  }

  componentDidMount () {
    if (this.context.log) {
      console.log('Box did mount');
    }
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.keyUpEventHandler);
    if (this.context.log) {
      console.log('Box unmounted');
    }
  }

  render () {
    const mergedStyle = Object.assign({}, ...[styles.box, this.isAlternate && styles.boxAlternate]);
    return (
      <surface style={mergedStyle}>
        Hello "{this.context.foo}" Worlds
      </surface>
    );
  }

  onKeyUp (e: KeyboardEvent) {
    if (e.key === ' ') {
      this.isAlternate = !this.isAlternate;
      if (this.context.log) {
        console.log('Toggled alternate to', this.isAlternate);
      }
    }
  }
}

const styles = {
  box: {
    background: 'blue',
    marginBottom: 10
  },

  boxAlternate: {
    background: 'green'
  }
};
