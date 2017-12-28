import * as React from 'react';
import {observer} from 'mobx-react/custom';
import {SurfaceStore} from './SurfaceStore';
import {observable, action} from 'mobx';
import * as Color from 'color';

@observer
export class SurfaceDevTools extends React.Component<{
  store: SurfaceStore,
  style?: SurfaceStyle
}> {
  @observable isMinimized: boolean = true;
  @observable isHovered: boolean = false;

  @action
  toggle () {
    this.isMinimized = !this.isMinimized;
  }

  @action
  hover (isHovered: boolean) {
    this.isHovered = isHovered;
  }

  render () {
    const style = {
      ...this.props.style,
      ...styles.devTools
    };

    return (
      <surface
        {...style}
        onClick={() => this.toggle()}
        onMouseEnter={() => this.hover(true)}
        onMouseLeave={() => this.hover(false)}
      >
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
    <text value="DevTools"/>
  </surface>
);

const SurfaceStats = ({store}: {store: SurfaceStore}) => (
  <surface>
    <text value={'surfaces: ' + store.surfaceCount}/>
    <text value={'tweens: ' + store.tweenCount}/>
  </surface>
);

const styles = {
  devTools: {
    color: Color.rgb('#000000'),
    backgroundColor: Color.rgb('#ffffff'),
    padding: 10,
    borderRadius: 10
  }
};
