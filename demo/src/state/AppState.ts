import {ToastyStore} from './ToastyStore';
import {SurfaceStore} from '../../../src/lib/SurfaceStore';
import {StreamStore} from './StreamStore';

export class AppState {
  surface: SurfaceStore;
  toasties = new ToastyStore();
  stream = new StreamStore();

  initializeBehavior () {
    return [
      ...this.toasties.initializeBehavior(),
      ...this.stream.initializeBehavior()
    ];
  }
}
