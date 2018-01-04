import * as React from 'react';
import {interaction} from 'pixi.js';
import * as Color from 'color';
import {observer} from 'mobx-react/custom';
import {observable, action} from 'mobx';
import {tweenSugar} from './UISettings';
import {grid} from './UISettings';

@observer
export class Button extends React.Component<{
  label: string,
  onClick?: (e: interaction.InteractionEvent) => void;
}> {
  @observable isHovered = false;
  @observable isActive = false;

  @action
  setActive (isActive: boolean) {
    this.isActive = isActive;
  }

  @action
  setHovered (isHovered: boolean) {
    this.isHovered = isHovered;
  }

  render () {
    return (
      <surface
        {...styles.button(this.isHovered, this.isActive)}
        onMouseDown={this.setActive.bind(this, true)}
        onMouseUp={this.setActive.bind(this, false)}
        onMouseEnter={this.setHovered.bind(this, true)}
        onMouseLeave={this.setHovered.bind(this, false)}
        onClick={this.props.onClick}
      >
        {this.props.label}
      </surface>
    );
  }
}

const styles = {
  button (isHovered: boolean, isActive: boolean) {
    return {
      padding: grid.gutter,
      flexDirection: 'row',
      opacity: tweenSugar.press.toggle(1, 0.8, isActive),
      backgroundColor: tweenSugar.focus.toggle(Color.rgb('#267835'), Color.rgb('#3ea851'), isHovered)
    } as SurfaceStyle;
  }
};
