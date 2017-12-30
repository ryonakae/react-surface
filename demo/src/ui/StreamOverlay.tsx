import * as React from 'react';
import * as Color from 'color';
import {SurfaceStyleSheet} from '../../../src/lib/SurfaceStyleSheet';
import {commonStyles, grid} from './UISettings';
import {ToastyOverlay} from './ToastyOverlay';
import {RichLink} from './Link';
import {AppStateComponent} from '../AppStateComponent';
import {observer} from 'mobx-react/custom';
import {computed} from 'mobx';
import * as moment from 'moment';

@observer
export class StreamOverlay extends AppStateComponent {
  @computed get uptimeString () {
    const duration = moment.duration(this.appState.stream.uptime);

    return [duration.hours(), duration.minutes(), duration.seconds()]
      .map((value) => value.toString().padStart(2, '0'))
      .join(':');
  }

  render () {
    return (
      <surface {...styles.streamOverlay}>
        <surface {...styles.header}>
          <surface {...styles.logo}/>
          <surface flexGrow={1}>
            <surface {...styles.title}>{this.appState.stream.title}</surface>
            <surface {...styles.nowPlaying}>
              Now playing: {this.appState.stream.nowPlaying}
            </surface>
          </surface>
          <surface {...styles.stats}>
            <surface {...styles.statsItem}>
              {this.appState.stream.viewerCount} Viewers
            </surface>
            <surface {...styles.statsItem}>
              Uptime: {this.uptimeString}
            </surface>
          </surface>
        </surface>
        <surface flexGrow={1} flexDirection="row">
          <surface {...styles.window}>
            Screen
          </surface>
          <surface {...styles.widgets}>
            <ToastyOverlay style={{flexGrow: 1}}/>
            <Chatbox/>
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

const Chatbox = () => (
  <surface {...styles.chatbox}>
    Chatbox
  </surface>
);

const commonPadding = grid.gutter * 3;
const styles = SurfaceStyleSheet.create({
  streamOverlay: {
    flexGrow: 1,
    backgroundColor: Color.rgb('#152951'),
    backgroundImage: require('../assets/bg.jpg'),
    backgroundSize: 'cover',
    backgroundOpacity: 0.5,
    paddingTop: grid.paddingTop,
    paddingRight: grid.paddingRight,
    paddingBottom: grid.paddingBottom,
    paddingLeft: grid.paddingLeft
  },

  header: {
    flexDirection: 'row',
    backgroundColor: Color.rgb('#2645bf'),
    marginBottom: grid.gutter
  },

  logo: {
    position: 'absolute',
    top: 0, right: 0,
    backgroundImage: require('../assets/logo.png'),
    backgroundPosition: ['100%', 0],
    width: grid.xSpan(2),
    height: grid.ySpan(1)
  },

  title: commonStyles.blueLine,
  nowPlaying: {
    ...commonStyles.blueLine,
    marginTop: grid.gutter
  },

  stats: {
    alignSelf: 'flex-end',
    flexDirection: 'row'
  },

  statsItem: {
    flexDirection: 'row',
    marginLeft: grid.gutter,
    alignItems: 'flex-end'
  },

  window: {
    ...commonStyles.centeredContent,
    flexGrow: 1,
    backgroundColor: Color.rgb('#2645bf')
  },

  widgets: {
    width: grid.xSpan(2),
    marginLeft: commonPadding,
    backgroundColor: Color.rgb('#2645bf')
  },

  chatbox: {
    flexGrow: 1,
    backgroundColor: Color.rgb('#123123')
  },

  footer: {
    height: grid.ySpan(1),
    marginTop: commonPadding,
    backgroundColor: Color.rgb('#2645bf'),
    flexDirection: 'row'
  }
});
