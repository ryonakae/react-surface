import {Surface} from './Surface';

export class SurfaceComponentTree {
  private idCounter = 0;
  private fibersBySurfaceId: {[key: string]: FiberNode} = {};
  private surfacesByNodeId: {[key: string]: Surface} = {};

  getNexSurfaceId () {
    const nextId = this.idCounter;
    this.idCounter += 1;
    return nextId;
  }

  register (fiber: FiberNode, instance: Surface) {
    instance.id = this.getNexSurfaceId();
    this.fibersBySurfaceId[instance.id] = fiber;
    this.surfacesByNodeId[fiber.id] = instance;
  }

  release (instance: Surface) {
    const fiber = this.findFiberBySurface(instance);
    if (fiber) {
      delete this.fibersBySurfaceId[instance.id];
      delete this.surfacesByNodeId[fiber.id];
    }
  }

  findFiberByHostInstance (hostInstance: any): FiberNode {
    // TODO optimize: don't do linear search
    const surface = Object.values(this.surfacesByNodeId)
      .find((surface) => surface.hostInstance === hostInstance);
    if (surface) {
      return this.findFiberBySurface(surface);
    }
  }

  findHostInstanceByFiber (fiber: FiberNode): any {
    return this.findSurfaceByFiber(fiber).hostInstance;
  }

  findFiberBySurface (instance: Surface): FiberNode {
    return this.fibersBySurfaceId[instance.id];
  }

  findSurfaceByFiber (fiber: FiberNode): Surface {
    return this.surfacesByNodeId[fiber.id];
  }
}
