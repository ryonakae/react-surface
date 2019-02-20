import * as React from 'react';
import * as Color from 'color';
import {Toasty, ToastyState} from '../state/Toasty';
import {tweenSugar} from './TweenPresets';
import {computed} from 'mobx';
import {observer} from 'mobx-react/custom';
import {Crossfader} from '../lib/Crossfader';
import {grid} from './UISettings';
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

  messageSize: Size;

  @computed get displayedContent () {
    if (this.props.toasty.state <= ToastyState.Exclaiming) {
      return '!';
    }
    if (this.props.toasty.state <= ToastyState.Presenting) {
      return this.props.toasty.message;
    }
    if (this.props.toasty.state <= ToastyState.Logging) {
      return ellipsis(this.props.toasty.message, 20);
    }
    return '...';
  }

  async componentWillEnter () {
    await Promise.all([
      this.tweens.opacity.to(1),
      this.tweens.translateY.transition(itemHeight, 0)
    ]);
  }

  async componentWillExit () {
    await Promise.all([
      this.tweens.opacity.to(0),
      this.tweens.translateX.to(-this.appState.toasties.containerSize.width / 3)
    ]);
  }

  async transitionWidth (messageSize: Size) {
    const targetWidth = messageSize.width + itemPadding * 2;
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
        this.props.toasty,
      )
    };

    return (
      <surface {...style} onClick={this.onClick.bind(this)}>
        <Crossfader>
          <surface key={this.displayedContent} onSizeChanged={this.transitionWidth.bind(this)}>
            {this.displayedContent}
          </surface>
        </Crossfader>
      </surface>
    );
  }

  onClick () {
    this.props.toasty.progress();
  }
}

const itemPadding = grid.gutter;
const itemHeight = grid.ySpan(1);
const itemSpacing = itemPadding;

const styles = {
  toasty (index: number, containerSize: Size, toasty: Toasty) {
    const yOffset = tweenSugar.slide.to(
      toasty.state <= ToastyState.Presenting ?
        containerSize.height - itemHeight :
        index * (itemHeight + itemSpacing)
    );

    return {
      position: 'absolute',
      right: 0,
      top: yOffset,
      padding: itemPadding,
      height: itemHeight,
      borderRadius: itemPadding,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Color.rgb('#1767ea'),
      overflow: 'hidden'
    } as SurfaceStyle;
  }
};

function ellipsis (str: string, maxLength: number) {
  if (!str) {
    return '...';
  }

  if (str.length <= maxLength) {
    return str;
  }
  return `${str.substr(0, maxLength)}...`;
}
