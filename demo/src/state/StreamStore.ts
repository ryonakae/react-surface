import {observable, action} from 'mobx';

export class StreamStore {
  @observable title = '';
  @observable nowPlaying = '';
  @observable viewerCount: number = 50;
  @observable uptime: number = 0;

  @action
  setTitle (newTitle: string) {
    this.title = newTitle;
  }

  @action
  setNowPlaying (nowPlaying: string) {
    this.nowPlaying = nowPlaying;
  }

  @action
  setViewerCount (viewerCount: number) {
    this.viewerCount = viewerCount;
  }

  @action
  setUptime (uptime: number) {
    this.uptime = uptime;
  }

  initializeBehavior () {
    // HACK temporary development code
    // TODO remove
    const startTime = new Date();
    const timeIntervalId = setInterval(
      () => this.setUptime(new Date().getTime() - startTime.getTime()),
      1000
    );

    return [
      () => clearInterval(timeIntervalId)
    ];
  }
}
