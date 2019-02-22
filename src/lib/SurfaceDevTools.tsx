import * as React from 'react';
import {observer} from 'mobx-react/custom';
import {SurfaceStore} from './SurfaceStore';
import {observable, action} from 'mobx';
import * as Color from 'color';
import {SurfaceStyle} from 'global';

@observer
export class SurfaceDevTools extends React.Component<{
  store: SurfaceStore,
  style?: SurfaceStyle
}> {
  @observable isMinimized: boolean = true;

  @action
  toggle () {
    this.isMinimized = !this.isMinimized;
  }

  render () {
    const style = {
      ...this.props.style,
      ...styles.devTools
    };

    return (
      <surface {...style} onClick={() => this.toggle()}>
        {
          this.isMinimized ?
            <ToggleButton/> :
            <SurfaceStats store={this.props.store}/>
        }
      </surface>
    );
  }
}

const ToggleButton = () => (
  <surface>
    SurfaceDevTools
  </surface>
);

@observer
class SurfaceStats extends React.Component<{store: SurfaceStore}> {
  render () {
    return (
      <surface>
        surfaces: {this.props.store.surfaceCount}
        tweens: {this.props.store.tweenCount}
      </surface>
    );
  }
}

const styles = {
  devTools: {
    color: Color.rgb('#000000'),
    backgroundColor: Color.rgb('#ffffff'),
    padding: 10,
    borderRadius: 10
  }
};
