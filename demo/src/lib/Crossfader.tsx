import * as React from 'react';
import {LifecycleTransitionGroup, TransitionState} from './LifecycleTransitionGroup';
import {Tween} from '../../../src/index';

export class Crossfader extends React.Component<{
  children: React.ReactElement<any>
}> {
  render () {
    return (
      <LifecycleTransitionGroup>
        {[
          <FadeTransition key={this.props.children.key}>
            {this.props.children}
          </FadeTransition>
        ]}
      </LifecycleTransitionGroup>
    );
  }
}

class FadeTransition extends React.Component {
  opacity = new Tween(0);

  componentWillTransition (state: TransitionState) {
    return this.opacity.toggle(0, 1, state === TransitionState.Entering);
  }

  render () {
    return (
      <surface position="absolute" opacity={this.opacity}>
        {this.props.children}
      </surface>
    );
  }
}
