import * as React from 'react';
import {fonts} from './assets/fonts';
import * as Color from 'color';
import {SurfaceStyleSheet} from '../../src/lib/SurfaceStyleSheet';
import {Button} from './ui/Button';
import {SurfaceDevTools} from '../../src/lib/SurfaceDevTools';
import {StreamOverlay} from './ui/StreamOverlay';
import {grid} from './ui/UISettings';
import {appStateContext} from './AppStateComponent';
import {AppState} from './state/AppState';

export class App extends React.Component<{state: AppState}> {
  static childContextTypes = appStateContext;
  getChildContext () {
    return {
      state: this.props.state
    };
  }

  private behaviorDisposers: Array<() => void>;

  componentWillMount () {
    this.behaviorDisposers = this.props.state.initializeBehavior();
  }

  componentWillUnmount () {
    this.behaviorDisposers.forEach((dispose) => dispose());
  }

  render () {
    return (
      <surface {...styles.app}>
        <StreamOverlay/>
        <div {...styles.devTools}>
          <SurfaceDevTools store={this.props.state.surface} />
          <Button label="Spawn Toasty" onClick={() => this.props.state.toasties.spawnToasty(false)}/>
        </div>
      </surface>
    );
  }
}

const styles = SurfaceStyleSheet.create({
  app: {
    flexGrow: 1,
    backgroundColor: Color.rgb('#000000'),
    color: Color.rgb('#ffffff'),
    fontSize: 14,
    fontFamily: fonts.Default
  },

  devTools: {
    position: 'absolute',
    top: grid.gutter, left: grid.gutter,
    flexDirection: 'row'
  },

  toastyOverlay: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0, left: 0
  }
});
