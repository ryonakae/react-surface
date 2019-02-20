import * as React from 'react';
import {observer} from 'mobx-react/custom';
import {observable, action} from 'mobx';

type Instance = {
  componentWillEnter?: () => Promise<any>;
  componentWillExit?: () => Promise<any>;
  componentWillTransition?: (state: TransitionState) => Promise<any>;
};

export enum TransitionState {
  NotMounted,
  Entering,
  Entered,
  Exiting,
  Exited
}

type Props = {
  children: Array<React.ReactElement<any>>
};

@observer
export class LifecycleTransitionGroup extends React.Component<Props> {
  @observable transitions = new Map<string, Transition>();
  private shouldSyncOnUpdate!: boolean;

  componentWillMount () {
    this.syncTransitionChildren(this.props.children);
  }

  componentDidMount () {
    this.syncTransitionChildren(this.props.children);
  }

  componentWillReceiveProps (nextProps: Props) {
    this.syncTransitionChildren(nextProps.children);
    this.shouldSyncOnUpdate = true;
  }

  componentDidUpdate () {
    if (this.shouldSyncOnUpdate) {
      this.syncTransitionChildren(this.props.children);
      this.shouldSyncOnUpdate = false;
    }
  }

  /**
   * Identify added and removed children
   */
  @action
  private async syncTransitionChildren (children: Props['children']) {
    // Mark all for potential exits
    this.transitions.forEach((t) => t.expired = true);

    const childList = children || [];
    for (const element of childList) {
      if (!element) {
        continue;
      }

      const key: any = element.key;
      if (!key) {
        throw new Error('Every child needs a unique key');
      }

      let transition = this.transitions.get(key);

      // Added
      if (!transition) {
        transition = new Transition();
        transition.key = key;
        this.transitions.set(key, transition);
      }

      if (transition.canEnter) {
        transition.enter();
      }

      transition.element = element;
      transition.expired = false; // Still here, don't expire
    }

    // Exit the ones that expired
    Array.from(this.transitions.values())
      .filter((transition) => transition.expired)
      .map(this.expireTransition.bind(this));
  }

  private async expireTransition (transition: Transition) {
    if (transition.canExit) {
       await transition.exit();
       if (transition.state === TransitionState.Exited) {
         this.unmountTransition(transition);
       }
     }
  }

  @action
  private unmountTransition (transition: Transition) {
    this.transitions.delete(transition.key);
  }

  render () {
    const transitionElements = Array
      .from(this.transitions.values())
      .map((transition) =>
        React.cloneElement(transition.element, {
          ref: (instance: Instance) => transition.instance = instance
        })
      );

    return (
      <React.Fragment>
        {transitionElements}
      </React.Fragment>
    );
  }
}

class Transition {
  key: any;
  state: TransitionState = TransitionState.NotMounted;
  instance?: Instance;
  @observable element!: React.ReactElement<any>;
  @observable expired!: boolean;

  get canEnter () {
    return this.state !== TransitionState.Entering && this.state !== TransitionState.Entered;
  }

  get canExit () {
    return this.state !== TransitionState.Exiting && this.state !== TransitionState.Exited;
  }

  async enter () {
    if (this.instance) {
      this.state = TransitionState.Entering;
      if (this.instance.componentWillEnter) {
        await this.instance.componentWillEnter();
      }
      if (this.instance && this.instance.componentWillTransition) {
        await this.instance.componentWillTransition(TransitionState.Entering);
      }
      if (this.state === TransitionState.Entering) {
        this.state = TransitionState.Entered;
      }
    }
  }

  async exit () {
    if (this.instance) {
      this.state = TransitionState.Exiting;
      if (this.instance.componentWillExit) {
        await this.instance.componentWillExit();
      }
      if (this.instance && this.instance.componentWillTransition) {
        await this.instance.componentWillTransition(TransitionState.Exiting);
      }
      if (this.state === TransitionState.Exiting) {
        this.state = TransitionState.Exited;
      }
    }
  }
}
