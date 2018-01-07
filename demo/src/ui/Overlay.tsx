import * as React from 'react';
import {SurfaceStyleSheet} from '../../../src/lib/SurfaceStyleSheet';
import {commonColors, commonStyles, grid} from './UISettings';
import {observer} from 'mobx-react/custom';
import {duration} from 'moment';
import {ToastyList} from './ToastyList';
import {AppStateComponent} from '../AppStateComponent';
import {Chatbox} from './Chatbox';
import {StreamStore} from '../state/StreamStore';
import {defaultToastyHeight, toastySpacing} from './ToastyItem';
import {maxToastyLogSize} from '../state/ToastyStore';

@observer
export class Overlay extends AppStateComponent {
  render () {
    return (
      <surface
        {...styles.streamOverlay}
        onSizeChanged={(size) => this.appState.toasties.updateOverlaySize(size)}
      >
        <surface maskedBy={1} {...styles.background}/>

        <surface {...styles.header}>
          <surface {...styles.title}>
            {this.appState.stream.title}
          </surface>
          <surface {...styles.stats}>
            {this.appState.stream.isOnline ?
              <StreamStats stream={this.appState.stream}/> :
              'Offline'
            }
          </surface>
        </surface>

        <surface flexGrow={1} flexDirection="row">
          <surface mask={1} {...styles.window}/>
          <surface {...styles.widgets}>
            <Chatbox style={styles.chatbox} chatStore={this.appState.chatbox}/>
            <ToastyList style={styles.toasties}/>
          </surface>
        </surface>
      </surface>
    );
  }
}

@observer
class StreamStats extends React.Component<{stream: StreamStore}> {
  render () {
    const d = duration(this.props.stream.uptime);
    const uptimeString = [d.hours(), d.minutes(), d.seconds()]
      .map((value) => value.toString().padStart(2, '0'))
      .join(':');

    return (
      <React.Fragment>
        <surface {...styles.statsItem}>
          {this.props.stream.viewerCount} <surface {...styles.viewersIcon}/>
        </surface>
        <surface {...styles.statsItem}>
          {uptimeString} <surface {...styles.timeIcon}/>
        </surface>
      </React.Fragment>
    );
  }
}

const commonPadding = grid.gutter * 3;
const toastyBoxHeight = maxToastyLogSize * (defaultToastyHeight + toastySpacing);
const rightBounds = {
  width: grid.xSpan(3),
  marginLeft: commonPadding,
};

const styles = SurfaceStyleSheet.create({
  background: {
    ...commonStyles.dock,
    backgroundColor: commonColors.darkBlue,
    backgroundImage: require('../assets/bg.jpg'),
    backgroundSize: 'cover',
    backgroundOpacity: 0.2,
  },

  streamOverlay: {
    flexGrow: 1,
    paddingTop: grid.paddingTop,
    paddingRight: grid.paddingRight,
    paddingBottom: grid.paddingBottom,
    paddingLeft: grid.paddingLeft
  },

  header: {
    flexDirection: 'row',
    height: grid.ySpan(1),
    fontSize: grid.fontSize(0.5),
    marginBottom: grid.gutter,
  },

  title: {
    flexGrow: 1,
    justifyContent: 'center',
    overflow: 'hidden'
  },

  nowPlaying: {
    alignItems: 'flex-end',
  },

  stats: {
    ...rightBounds,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },

  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '50%'
  },

  viewersIcon: {
    marginLeft: grid.gutter / 2,
    width: grid.ySpan(0.5),
    height: grid.ySpan(0.5),
    backgroundImage: require('../assets/viewers.png')
  },

  timeIcon: {
    marginLeft: grid.gutter / 2,
    width: grid.ySpan(0.5),
    height: grid.ySpan(0.5),
    backgroundImage: require('../assets/clock.png')
  },

  window: {
    flexGrow: 1,
    border: grid.gutter / 2,
    borderColor: commonColors.darkGray,
    dropShadowColor: commonColors.black,
    dropShadowSize: grid.gutter / 2,
    backgroundColor: commonColors.lightBlue.alpha(0)
  },

  widgets: {
    ...rightBounds,
    justifyContent: 'flex-end'
  },

  toasties: {
    position: 'absolute',
    top: 0, right: 0,
    width: rightBounds.width,
    height: toastyBoxHeight
  },

  chatbox: {
    height: grid.ySpan(15) - toastyBoxHeight
  }
});
