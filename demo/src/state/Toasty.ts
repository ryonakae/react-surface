import {action, observable} from 'mobx';

let idCounter = 0;

export enum ToastyState {
  Idle,
  Exclaiming,
  Presenting,
  Logging,
  Archived
}

export class Toasty {
  id: number = idCounter += 1;
  message!: string;
  createdAt: Date = new Date();
  @observable state = ToastyState.Idle;

  @action
  progress (to: ToastyState = this.state + 1) {
    if (to !== undefined) {
      if (this.state < to) {
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
