import * as React from 'react';
import {SurfaceStyleSheet} from '../../../src/lib/SurfaceStyleSheet';
import {Toasty} from '../state/Toasty';

export class ToastyItem extends React.Component<{toasty: Toasty}> {
  render () {
    return (
      <surface {...styles.toasty}>
        <text value={this.props.toasty.message}/>
      </surface>
    );
  }
}

const styles = SurfaceStyleSheet.create({
  toasty: {
    padding: 10
  },
});
