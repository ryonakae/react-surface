import {BaseSurface} from './BaseSurface';
import * as EventEmitter from 'events';

export class TestSurface extends BaseSurface {
  public events = new EventEmitter();

  protected addEventListener (name: string, handler: (e: Event) => any) {
    this.events.addListener(name, handler);
  }

  protected removeEventListener (name: string, handler: (e: Event) => any) {
    this.events.removeListener(name, handler);
  }

  emitEvent (e: Event) {
    this.events.emit(e.type, e);
  }
}
