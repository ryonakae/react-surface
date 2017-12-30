import * as React from 'react';
import {ToastyItem} from './ToastyItem';
import {observer} from 'mobx-react/custom';
import {LifecycleTransitionGroup} from '../lib/LifecycleTransitionGroup';
import {AppStateComponent} from '../AppStateComponent';

@observer
export class ToastyOverlay extends AppStateComponent<{style?: SurfaceStyle}> {
  render () {
    return (
      <surface {...this.props.style} onSizeChanged={(size) => this.appState.toasties.updateContainerSize(size)}>
        <LifecycleTransitionGroup>
          {this.appState.toasties.visibleToasties.map((toasty, index) => (
            <ToastyItem
              key={toasty.id}
              index={index}
              toasty={toasty}
            />
          ))}
        </LifecycleTransitionGroup>
      </surface>
    );
  }
}
