import * as React from 'react';
import {SurfaceStyleSheet} from '../../../src/lib/SurfaceStyleSheet';
import {Toasty} from '../state/Toasty';

export class ToastyList extends React.Component<{toasties: Toasty[]}> {
  render () {
    return (
      <surface {...styles.toastyList}>

      </surface>
    );
  }
}

const styles = SurfaceStyleSheet.create({
  toastyList: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0, left: 0
  },
});
