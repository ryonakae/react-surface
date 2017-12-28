import * as React from 'react';
import {fonts} from './assets/fonts';
import * as Color from 'color';
import {SurfaceStyleSheet} from '../../src/lib/SurfaceStyleSheet';
import {ToastyOverlay} from './ui/ToastyOverlay';
import {Button} from './ui/Button';
import {ToastyStore} from './state/ToastyStore';
import {SurfaceDevTools} from '../../src/lib/SurfaceDevTools';
import {SurfaceStore} from '../../src/lib/SurfaceStore';

export class App extends React.Component<{
  toastyStore: ToastyStore,
  surfaceStore: SurfaceStore
}> {
  private behaviorDisposers: Array<() => void>;

  componentWillMount () {
    this.behaviorDisposers = this.props.toastyStore.initializeBehavior();
  }

  componentWillUnmount () {
    this.behaviorDisposers.forEach((dispose) => dispose());
  }

  render () {
    return (
      <surface {...styles.app}>
        <surface {...styles.content}>
          <Button label="Spawn Toasty" onClick={() => this.props.toastyStore.spawnToasty(false)}/>
        </surface>
        <SurfaceDevTools store={this.props.surfaceStore} style={styles.devTools}/>
        <ToastyOverlay toastyStore={this.props.toastyStore} style={styles.toastyOverlay}/>
      </surface>
    );
  }
}

const styles = SurfaceStyleSheet.create({
  app: {
    flexGrow: 1,
    backgroundColor: Color.rgb('#000000'),
    flexWrap: 'wrap',
    flexDirection: 'row',
    color: Color.rgb('#ffffff'),
    fontSize: 14,
    fontFamily: fonts.Default
  },

  devTools: {
    position: 'absolute',
    bottom: 10, left: 10
  },

  content: {
    position: 'absolute'
  },

  toastyOverlay: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0, left: 0
  }
});
