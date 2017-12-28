import * as React from 'react';
import {observer} from 'mobx-react/custom';
import {SurfaceStore} from './SurfaceStore';

@observer
export class SurfaceDevTools extends React.Component<{
  stats: SurfaceStore,
  style?: SurfaceStyle
}> {
  render () {
    return (
      <surface {...this.props.style}>
        <text value={'surfaces: ' + this.props.stats.surfaceCount}/>
      </surface>
    );
  }
}
