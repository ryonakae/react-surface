import * as React from 'react';
import {Toasty, ToastyState, ToastyType} from '../state/Toasty';
import {tweenSugar} from './UISettings';
import {observer} from 'mobx-react/custom';
import {Crossfader} from '../lib/Crossfader';
import {commonColors, grid} from './UISettings';
import {AppStateComponent} from '../AppStateComponent';
import {IReactionDisposer, autorun, action, observable} from 'mobx';
import {TweenOptions} from '../../../src/lib/tween/TweenOptions';

@observer
export class ToastyItem extends AppStateComponent<{
  index: number,
  toasty: Toasty
}> {
  private stopReacting: IReactionDisposer;
  @observable messageSize: Size = {width: 0, height: 0};

  tweens = {
    opacity: tweenSugar.slide.tween(0),
    translateY: tweenSugar.slide.tween(0, new TweenOptions({immediate: true, rounded: true})),
    translateX: tweenSugar.slide.tween(0, new TweenOptions({immediate: true, rounded: true})),
    width: tweenSugar.slide.tween(0, new TweenOptions({immediate: true, rounded: true}))
  };

  async componentWillEnter () {
    await this.tweens.opacity.to(1);
  }

  async componentWillExit () {
    await Promise.all([
      this.tweens.width.promise,
      this.tweens.translateX.promise,
      this.tweens.translateY.promise,
      this.tweens.opacity.to(0)
    ]);
  }

  componentWillMount () {
    this.stopReacting = autorun(() =>
      this.tweenToState(
        this.props.toasty.state,
        this.appState.toasties.containerBounds,
        this.appState.toasties.overlaySize,
        this.messageSize
      )
    );
  }

  componentWillUnmount () {
    this.stopReacting();
  }

  componentWillUpdate () {
    this.tweenToState(
      this.props.toasty.state,
      this.appState.toasties.containerBounds,
      this.appState.toasties.overlaySize,
      this.messageSize
    );
  }

  tweenToState (state: ToastyState, containerBounds: Bounds, overlaySize: Size, contentSize: Size) {
    const yDelta = overlaySize.height - containerBounds.top * 2;
    const xDelta = overlaySize.width - containerBounds.right * 2;
    const isTop = this.props.toasty.type === ToastyType.Top;

    const toastySize = {
      width: contentSize.width + toastyPadding * 2,
      height: Math.max(contentSize.height + toastyPadding * 2, defaultToastyHeight) + grid.gutter
    };

    this.tweens.width.to(toastySize.width);

    const y = this.tweens.translateY;
    const x = this.tweens.translateX;
    switch (state) {
      case ToastyState.Idle:
        x.to((xDelta - contentSize.width) / 2);
        y.to(yDelta + defaultToastyHeight);
        break;
      case ToastyState.Exclaiming:
        x.to((xDelta + toastySize.width) / 2);
        y.to(isTop ? -toastySize.height : yDelta);
        break;
      case ToastyState.Presenting:
        x.to((xDelta + toastySize.width) / 2);
        y.to(isTop ? -toastySize.height : (yDelta - toastySize.height) / 2);
        break;
      case ToastyState.Logging:
        x.to(0);
        y.to(this.props.index * (defaultToastyHeight + toastyPadding));
        break;
      case ToastyState.Archived:
        y.to(y.value - toastySize.height);
        break;
    }
  }

  @action
  updateSize (messageSize: Size) {
    this.messageSize = messageSize;
  }

  render () {
    const style = {
      ...this.tweens,
      ...styles.toasty
    };

    return (
      <surface {...style} onClick={this.onClick.bind(this)}>
        <Crossfader>
          <surface key={this.props.toasty.message} onSizeChanged={this.updateSize.bind(this)}>
            {this.props.toasty.message}
          </surface>
        </Crossfader>
      </surface>
    );
  }

  onClick (e: PIXI.interaction.InteractionEvent) {
    if (e.data.button) {
      this.props.toasty.progress(this.props.toasty.state - 1);
    } else {
      this.props.toasty.progress();
    }
  }
}

export const toastyPadding = grid.gutter;
export const defaultToastyHeight = grid.ySpan(1);
export const toastySpacing = toastyPadding;

const styles = {
  toasty: {
    position: 'absolute',
    right: 0,
    padding: toastyPadding,
    height: defaultToastyHeight,
    borderRadius: toastyPadding,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: commonColors.darkBlue,
    overflow: 'hidden'
  } as SurfaceStyle
};
