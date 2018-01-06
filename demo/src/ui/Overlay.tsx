import * as React from 'react';
import {SurfaceStyleSheet} from '../../../src/lib/SurfaceStyleSheet';
import {commonColors, commonStyles, grid} from './UISettings';
import {observer} from 'mobx-react/custom';
import {duration} from 'moment';
import * as Color from 'color';
import {ToastyList} from './ToastyList';
import {AppStateComponent} from '../AppStateComponent';
import {Chatbox} from './Chatbox';
import {StreamStore} from '../state/StreamStore';

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
            <ToastyList style={styles.toasties}/>
            <Chatbox style={styles.chatbox} chatStore={this.appState.chatbox}/>
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
          {this.props.stream.viewerCount} viewers
        </surface>
        <surface {...styles.statsItem}>
          {uptimeString} uptime
        </surface>
      </React.Fragment>
    );
  }
}

const commonPadding = grid.gutter * 3;
const rightBounds = {
  width: grid.xSpan(2.5),
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
    marginBottom: grid.gutter,
  },

  title: {
    flexGrow: 1,
    fontSize: 16,
    justifyContent: 'flex-end',
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
    marginLeft: grid.gutter,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    minWidth: grid.xSpan(1)
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
    ...rightBounds
  },

  toasties: {
    flexGrow: 1,
    backgroundColor: Color.rgb('#3ba173'),
  },

  chatbox: {
    height: grid.ySpan(8)
  }
});
