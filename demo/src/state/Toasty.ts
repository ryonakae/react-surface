import {action, observable, computed} from 'mobx';

let idCounter = 0;

export enum ToastyState {
  Idle,
  Exclaiming,
  Presenting,
  Logging,
  Archived
}

export enum ToastyType {
  Top,
  Middle
}

export class Toasty {
  id: number = idCounter += 1;
  fullMessage: string;
  shortMessage: string;
  createdAt: Date = new Date();
  type: ToastyType = ToastyType.Middle;

  @observable state = ToastyState.Idle;

  get shouldBeLogged () {
    return this.type !== ToastyType.Top;
  }

  @computed get message () {
    if (this.state <= ToastyState.Exclaiming) {
      return '!';
    }
    if (this.state <= ToastyState.Presenting) {
      return this.fullMessage;
    }
    return this.shortMessage || this.fullMessage;
  }

  @action
  progress (to: ToastyState = this.state + 1) {
    if (!this.shouldBeLogged && to === ToastyState.Logging) {
      this.state = to + 1;
      return;
    }

    if (to !== undefined) {
      if (to > this.state) {
        this.state = to;
      }
    } else {
      this.state += 1;
    }
  }

  static compareAge (a: Toasty, b: Toasty) {
    if (a.createdAt === b.createdAt) {
      return 0;
    }
    return a.createdAt < b.createdAt ? -1 : 1;
  }
}

export class SubToasty extends Toasty {
  constructor (
    username: string,
    method: any,
    message: string
  ) {
    super();

    this.fullMessage = `${username} just subscribed!`;
    if (message) {
      this.fullMessage += `\n"${message}"`;
    }

    this.shortMessage = `Sub: ${username}`;
  }
}

export class ResubToasty extends Toasty {
  constructor (
    username: string,
    method: any,
    message: string,
    months: number
  ) {
    super();

    this.fullMessage = `${username} just resubscribed (x${months})!`;
    if (message) {
      this.fullMessage += `\n"${message}"`;
    }

    this.shortMessage = `Resub: ${username} (x${months})`;
  }
}

export class HostToasty extends Toasty {
  constructor (
    username: string,
    viewers: number,
    autoHost: boolean
  ) {
    super();
    this.fullMessage = `${username} just hosted with ${viewers} viewers!`;
    this.shortMessage = `Host: ${username} (x${viewers})`;
  }
}

export class InfoToasty extends Toasty {
  constructor (
    message: string,
  ) {
    super();
    this.fullMessage = message;
    this.shortMessage = message;
    this.type = ToastyType.Top;
  }
}
