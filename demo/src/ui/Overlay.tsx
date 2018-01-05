import * as React from 'react';
import {SurfaceStyleSheet} from '../../../src/lib/SurfaceStyleSheet';
import {commonColors, commonStyles, grid} from './UISettings';
import {observer} from 'mobx-react/custom';
import {computed} from 'mobx';
import {duration} from 'moment';
import * as Color from 'color';
import {ToastyList} from './ToastyList';
import {RichLink} from './Link';
import {AppStateComponent} from '../AppStateComponent';
import {Chatbox} from './Chatbox';

@observer
export class Overlay extends AppStateComponent {
  @computed get uptimeString () {
    const d = duration(this.appState.stream.uptime);

    return [d.hours(), d.minutes(), d.seconds()]
      .map((value) => value.toString().padStart(2, '0'))
      .join(':');
  }

  render () {
    return (
      <surface {...styles.streamOverlay}>
        <surface maskedBy={1} {...styles.background}/>

        <surface {...styles.header}>
          <surface {...styles.title}>
            {this.appState.stream.title}
          </surface>
          <surface {...styles.stats}>
            <surface {...styles.statsItem}>
              {this.appState.stream.viewerCount} viewers
            </surface>
            <surface {...styles.statsItem}>
              {this.uptimeString} uptime
            </surface>
          </surface>
        </surface>

        <surface flexGrow={1} flexDirection="row">
          <surface mask={1} {...styles.window}/>
          <surface {...styles.widgets}>
            <ToastyList style={styles.toasties}/>
            <Chatbox style={styles.chatbox} chatStore={this.appState.chatbox}/>
          </surface>
        </surface>

        <surface {...styles.footer}>
          <RichLink
            icon={require('../assets/codenjoy-icon.jpg')}
            name="codenjoy.tv"
            url="http://codenjoy.tv"
          />
          <RichLink
            icon={require('../assets/discord-icon.png')}
            name="discord.gg/Y2t9C2s"
            url="http://discord.gg/Y2t9C2s"
          />
          <RichLink
            icon={require('../assets/instagram-icon.png')}
            name="instagram.com/codenjoy"
            url="http://instagram.com/codenjoy"
          />
        </surface>
      </surface>
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
  },

  footer: {
    height: grid.ySpan(1),
    marginTop: commonPadding,
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});
