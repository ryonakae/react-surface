import {observable, action} from 'mobx';

export class OptionsStore {
  @observable enableDevtools: boolean;

  @action
  update (enableDevtools: boolean) {
    this.enableDevtools = enableDevtools;
  }
}
