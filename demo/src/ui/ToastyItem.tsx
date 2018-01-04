import * as React from 'react';
import {Toasty, ToastyState} from '../state/Toasty';
import {tweenSugar} from './UISettings';
import {observer} from 'mobx-react/custom';
import {Crossfader} from '../lib/Crossfader';
import {commonColors, grid} from './UISettings';
import {AppStateComponent} from '../AppStateComponent';

@observer
export class ToastyItem extends AppStateComponent<{
  index: number,
  toasty: Toasty
}> {
  tweens = {
    opacity: tweenSugar.bounce.tween(0),
    translateY: tweenSugar.bounce.tween(0),
    translateX: tweenSugar.slide.tween(0),
    width: tweenSugar.slide.tween(0)
  };

  async componentWillEnter () {
    await Promise.all([
      this.tweens.opacity.to(1),
      this.tweens.translateY.transition(toastyHeight, 0)
    ]);
  }

  async componentWillExit () {
    await Promise.all([
      this.tweens.opacity.to(0),
      this.tweens.translateX.to(-grid.xSpan(3))
    ]);
  }

  async transitionWidth (messageSize: Size) {
    const targetWidth = messageSize.width + toastyPadding * 2;
    if (this.tweens.width.value === 0) {
      this.tweens.width.set(targetWidth);
    } else {
      await this.tweens.width.to(targetWidth);
    }
  }

  render () {
    const style = {
      ...this.tweens,
      ...styles.toasty(
        this.props.index,
        this.appState.toasties.containerSize,
        this.props.toasty
      )
    };

    return (
      <surface {...style} onClick={this.onClick.bind(this)}>
        <Crossfader>
          <surface key={this.props.toasty.message} onSizeChanged={this.transitionWidth.bind(this)}>
            {this.props.toasty.message}
          </surface>
        </Crossfader>
      </surface>
    );
  }

  onClick () {
    this.props.toasty.progress();
  }
}

export const toastyPadding = grid.gutter;
export const toastyHeight = grid.ySpan(1);
export const toastySpacing = toastyPadding;

const styles = {
  toasty (index: number, containerSize: Size, toasty: Toasty) {
    const yOffset = tweenSugar.slide.to(
      toasty.state <= ToastyState.Presenting ?
        containerSize.height - toastyHeight :
        index * (toastyHeight + toastySpacing)
    );

    return {
      position: 'absolute',
      right: 0,
      top: yOffset,
      padding: toastyPadding,
      height: toastyHeight,
      borderRadius: toastyPadding,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      backgroundColor: commonColors.darkBlue,
      overflow: 'hidden'
    } as SurfaceStyle;
  }
};
