import {Surface} from './Surface';
import {observable, computed, action} from 'mobx';

export class SurfaceStore {
  private idCounter = 0;
  @observable private fibersBySurfaceId = new Map<number, FiberNode>();
  @observable private surfacesByFiberId = new Map<number, Surface>();

  @computed get surfaceCount () {
    return Array.from(this.surfacesByFiberId.keys()).length;
  }

  getNexSurfaceId () {
    const nextId = this.idCounter;
    this.idCounter += 1;
    return nextId;
  }

  @action
  register (fiber: FiberNode, surface: Surface) {
    surface.id = this.getNexSurfaceId();
    this.fibersBySurfaceId.set(surface.id, fiber);
    this.surfacesByFiberId.set(fiber._debugID, surface);
  }

  @action
  release (surface: Surface) {
    const fiber = this.fibersBySurfaceId.get(surface.id);
    this.surfacesByFiberId.delete(fiber._debugID);
    this.fibersBySurfaceId.delete(surface.id);
  }

  findFiberByHostInstance (hostInstance: any): FiberNode {
    // TODO optimize: don't do linear search
    const surface = Object.values(this.surfacesByFiberId)
      .find((surface) => surface.hostInstance === hostInstance);
    if (surface) {
      return this.findFiberBySurface(surface);
    }
  }

  findHostInstanceByFiber (fiber: FiberNode): any {
    return this.findSurfaceByFiber(fiber).hostInstance;
  }

  findFiberBySurface (instance: Surface): FiberNode {
    return this.fibersBySurfaceId.get(instance.id);
  }

  findSurfaceByFiber (fiber: FiberNode): Surface {
    return this.surfacesByFiberId.get(fiber._debugID);
  }
}
