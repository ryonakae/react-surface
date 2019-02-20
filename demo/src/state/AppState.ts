import {ToastyStore} from './ToastyStore';
import {SurfaceStore} from '../../../src/lib/SurfaceStore';

export class AppState {
  toasties = new ToastyStore();
  surface!: SurfaceStore;

  initializeBehavior () {
    return this.toasties.initializeBehavior();
  }
}
