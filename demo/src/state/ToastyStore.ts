import {Toasty, ToastyState} from './Toasty';
import {observable, computed, action, reaction} from 'mobx';

const emptyBounds = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0
};

export const maxToastyLogSize = 3;
const presentationCooldownTime = 3500;
const toastyTimes: {[key: string]: number} = {
  [ToastyState.Exclaiming]: 1000,
  [ToastyState.Presenting]: 3000
};

export class ToastyStore {
  private toastyTimeoutIds: any = {};

  @observable toasties: Toasty[] = [];
  @observable containerBounds: Bounds = emptyBounds;
  @observable overlaySize: Size = {width: 0, height: 0};
  @observable currentTime: number = 0;
  @observable nextPresentationTime: number = 0;

  @computed get canStartNewPresentation () {
    return this.nextPresentationTime <= this.currentTime;
  }

  @computed get visibleToasties () {
    return this.toasties
      .filter((toasty) => toasty.state > ToastyState.Idle && toasty.state < ToastyState.Archived)
      .sort(Toasty.compareAge);
  }

  @computed get loggedToasties () {
    return this.toasties
      .filter((toasty) => toasty.state === ToastyState.Logging)
      .sort(Toasty.compareAge);
  }

  @computed get currentPresentation () {
    const pres = this.toasties.find((toasty) =>
      toasty.state !== ToastyState.Idle && toasty.state <= ToastyState.Presenting
    );

    if (pres) {
      return pres;
    }

    return this.toasties
      .filter((toasty) => toasty.state === ToastyState.Idle)
      .sort(Toasty.compareAge)[0];
  }

  @action
  addToasty (toasty: Toasty) {
    this.toasties.push(toasty);
  }

  @action
  updateContainerBounds (bounds: Bounds) {
    this.containerBounds = bounds;
  }

  @action
  updateOverlaySize (size: Size) {
    this.overlaySize = size;
  }

  @action
  cooldownPresentation () {
    this.nextPresentationTime = this.currentTime + presentationCooldownTime;
  }

  @action
  updateTime () {
    this.currentTime = new Date().getTime();
  }

  progress (toasty: Toasty, to: ToastyState = toasty.state + 1) {
    toasty.progress(to);

    if (toasty.state < ToastyState.Logging) {
      clearTimeout(this.toastyTimeoutIds[toasty.id]);
      const nextMode = toasty.state + 1;
      this.toastyTimeoutIds[toasty.id] = setTimeout(
        () => this.progress(toasty, nextMode),
        toastyTimes[toasty.state] || 0
      );
    }
  }

  initializeBehavior () {
    // Update time every second
    const currentTimeIntervalId = setInterval(() => this.updateTime(), 1000);
    return [
      () => clearInterval(currentTimeIntervalId),

      // Show new presentations
      reaction(
        () => ({toasty: this.currentPresentation, allowed: this.canStartNewPresentation}),
        (payload) => {
          if (payload.toasty && payload.allowed) {
            this.cooldownPresentation();
            this.progress(payload.toasty);
          }
        },
        true
      ),

      // Archive toasties when log is full
      reaction(
        () => this.loggedToasties,
        (logged) => {
          const expired = logged.length - maxToastyLogSize;
          if (expired > 0) {
            logged
              .slice(0, expired)
              .forEach((toasty) => {
                toasty.progress(ToastyState.Archived);
                delete this.toastyTimeoutIds[toasty.id];
              });
          }
        },
        true
      )
    ];
  }
}
