import * as React from 'react';
import * as Color from 'color';
import {SurfaceStyleSheet} from '../../../src/lib/SurfaceStyleSheet';
import {commonStyles, grid} from './UISettings';
import {ToastyOverlay} from './ToastyOverlay';
import {RichLink} from './Link';

export class StreamOverlay extends React.Component {
  render () {
    return (
      <surface {...styles.streamOverlay}>
        <surface {...styles.header}>
          Header
        </surface>
        <surface flexGrow={1} flexDirection="row">
          <surface {...styles.window}>
            Screen
          </surface>
          <surface {...styles.widgets}>
            <ToastyOverlay style={{flexGrow: 1}}/>
          </surface>
        </surface>
        <surface {...styles.footer}>
          <RichLink name="instagram" url="instagram.com/codenjoy"/>
          <RichLink name="discord" url="discord.gg/Y2t9C2s"/>
        </surface>
      </surface>
    );
  }
}

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
    ...commonStyles.centeredContent,
    height: grid.ySpan(1),
    backgroundColor: Color.rgb('#2645bf'),
    marginBottom: grid.gutter
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

  footer: {
    ...commonStyles.centeredContent,
    height: grid.ySpan(1),
    marginTop: commonPadding,
    backgroundColor: Color.rgb('#2645bf'),
    flexDirection: 'row'
  }
});
