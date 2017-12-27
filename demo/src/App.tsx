import * as React from 'react';
import {fonts} from './assets/fonts';
import {SurfaceStyleSheet} from '../../src/lib/SurfaceStyleSheet';
import * as Color from 'color';
import {PropertyTweens} from './PropertyTweens';

export class App extends React.Component {
  render () {
    return (
      <surface {...styles.app}>
        <surface {...styles.backLayer}/>
        <PropertyTweens/>
      </surface>
    );
  }
}

const styles = SurfaceStyleSheet.create({
  app: {
    width: 900,
    height: 900,
    backgroundColor: Color.rgb('#102030'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    flexWrap: 'wrap',
    flexDirection: 'row',
    color: Color.rgb('#ffffff'),
    fontSize: 14,
    fontFamily: fonts.Default
  },

  backLayer: {
    backgroundColor: Color.rgb('#5498c4').alpha(0.5),
    position: 'absolute',
    top: 10, right: 10, bottom: 10, left: 10
  },

  frontLayer: {
    backgroundColor: Color.rgb('#629c36').alpha(0.5),
    position: 'absolute',
    top: 35, right: 35, bottom: 35, left: 35
  }
});
