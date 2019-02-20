import {Toasty, ToastyState} from './Toasty';
import {observable, computed, action, reaction} from 'mobx';

export const mockedMessages = [
  'You are looking mighty fine today, good sir!',
  'The pen is mightier than the sword if the sword is very short, and the pen is very sharp.',
  'In ancient times cats were worshipped as gods. They have not forgotten this.',
  '+++Divide By Cucumber Error. Please Reinstall Universe And Reboot +++',
  'The key to a continued heartbeat is to MOVE YOUR FEET.',
  'I give my life, on the steps... To heaven!',
  'My brethren fell to deaths cold embrace, Yet i stand alone against the countless horde!'
];

const logSize = 3;
const presentationCooldownTime = 3500;
const toastyTimes: {[key: string]: number} = {
  [ToastyState.Exclaiming]: 1000,
  [ToastyState.Presenting]: 3000
};

export class ToastyStore {
  private toastyTimeoutIds: any = {};

  @observable toasties: Toasty[] = [];
  @observable containerSize: Size = {width: 0, height: 0};
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
  spawnToasty (queue: boolean = true) {
    const toasty = new Toasty();
    toasty.message = randomizeItem(mockedMessages);
    if (!queue) {
      toasty.state = ToastyState.Presenting;
    }
    this.toasties.push(toasty);
  }

  @action
  updateContainerSize (size: Size) {
    this.containerSize = size;
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
        {
          fireImmediately: true
        }
      ),

      // Archive toasties when log is full
      reaction(
        () => this.loggedToasties,
        (logged) => {
          const expired = logged.length - logSize;
          if (expired > 0) {
            logged
              .slice(0, expired)
              .forEach((toasty) => {
                toasty.progress(ToastyState.Archived);
                delete this.toastyTimeoutIds[toasty.id];
              });
          }
        },
        {
          fireImmediately: true
        }
      ),

      // Queue new toasties automatically
      reaction(
        () => ({toasty: this.currentPresentation, allowed: this.canStartNewPresentation}),
        (payload) => {
          if (!payload.toasty && payload.allowed) {
            this.spawnToasty();
          }
        },
        {
          fireImmediately: true
        }
      )
    ];
  }
}

function randomizeItem<T> (items: T[]) {
  const randomIndex = Math.floor(Math.random() * (items.length) - 0.01);
  return items[randomIndex];
}
