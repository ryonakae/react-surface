import * as React from 'react';
import {fonts} from './assets/fonts';

export class App extends React.Component {
  render () {
    return (
      <div style={styles.app}>
        Hello World
      </div>
    );
  }
}

const styles = {
  app: {
    width: '100%',
    height: '100%',
    background: 'black',
    color: 'white',
    fontFamily: fonts.Default
  }
};
