import {InfoToasty, Toasty, ToastyState} from './Toasty';
import {observable, computed, action, reaction, when} from 'mobx';

const emptyBounds = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0
};

export const maxToastyLogSize = 3;
const presentationCooldown = 5000;
const infoToastyInterval = 60 * 5 * 1000;
const toastyTimes: {[key: string]: number} = {
  [ToastyState.Exclaiming]: 1500,
  [ToastyState.Presenting]: 6000
};

export class ToastyStore {
  private isRunning: boolean = false;
  private toastyTimeoutIds: any = {};
  private infoToastyContent: any[] = [];
  private nextInfoToastyIndex: number = -1;

  @observable toasties: Toasty[] = [];
  @observable containerBounds: Bounds = emptyBounds;
  @observable overlaySize: Size = {width: 0, height: 0};
  @observable currentTime: number = 0;

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

  @computed get presentation () {
    return this.toasties.find((toasty) =>
      toasty.state > ToastyState.Idle && toasty.state <= ToastyState.Presenting
    );
  }

  @action
  addToasty (toasty: Toasty) {
    this.toasties.push(toasty);

    if (!this.presentation) {
      this.presentNextToasty();
    }
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
  updateTime () {
    this.currentTime = new Date().getTime();
  }

  presentNextToasty () {
    const nextToasty = this.toasties
      .filter((toasty) => toasty.state === ToastyState.Idle)
      .sort(Toasty.compareAge)[0];

    if (nextToasty) {
      this.progress(nextToasty);
    }
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

  setInfoToastyContent (content: any[]) {
    this.infoToastyContent = content;
  }

  pullNextInfoToasty () {
    this.nextInfoToastyIndex = (this.nextInfoToastyIndex + 1) % this.infoToastyContent.length;
    return new InfoToasty(this.infoToastyContent[this.nextInfoToastyIndex]);
  }

  addNextInfoToasty () {
    const toasty = this.pullNextInfoToasty();
    this.addToasty(toasty);

    if (this.isRunning) {
      when(
        () => toasty.state === ToastyState.Archived,
        () => setTimeout(() => this.addNextInfoToasty(), infoToastyInterval)
      );
    }
  }

  initializeBehavior () {
    this.isRunning = true;
    this.addNextInfoToasty();

    // Update time every second
    const currentTimeIntervalId = setInterval(() => this.updateTime(), 1000);
    return [
      () => {
        clearInterval(currentTimeIntervalId);
        this.isRunning = false;
      },

      // Present the next toasty as soon as the current is done
      reaction(() => this.presentation, (pres) => {
        if (!pres) {
          setTimeout(() => this.presentNextToasty(), presentationCooldown);
        }
      }),

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
