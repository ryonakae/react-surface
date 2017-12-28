import * as React from 'react';
import {ToastyItem} from './ToastyItem';
import {observer} from 'mobx-react/custom';
import {LifecycleTransitionGroup} from '../lib/LifecycleTransitionGroup';
import {ToastyStore} from '../state/ToastyStore';

@observer
export class ToastyOverlay extends React.Component<{
  toastyStore: ToastyStore,
  style?: SurfaceStyle
}> {
  render () {
    return (
      <surface
        {...styles.toastyOverlay}
        {...this.props.style}
        onSizeChanged={(size) => this.props.toastyStore.updateContainerSize(size)}
      >
        <LifecycleTransitionGroup>
          {this.props.toastyStore.visibleToasties.map((toasty, index) => (
            <ToastyItem
              key={toasty.id}
              index={index}
              toastyStore={this.props.toastyStore}
              toasty={toasty}
            />
          ))}
        </LifecycleTransitionGroup>
      </surface>
    );
  }
}

const styles = {
  toastyOverlay: {
    margin: 10
  }
};
