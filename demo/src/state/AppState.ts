import {ToastyStore} from './ToastyStore';
import {SurfaceStore} from '../../../src/lib/SurfaceStore';
import {StreamStore} from './StreamStore';
import {ChatStore} from './ChatStore';
import {OptionsStore} from './OptionsStore';

export class AppState {
  surface: SurfaceStore;
  toasties = new ToastyStore();
  stream = new StreamStore();
  chatbox = new ChatStore();
  options = new OptionsStore();

  initializeBehavior () {
    return this.toasties.initializeBehavior();
  }
}
