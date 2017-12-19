export class SurfaceComponentTree {
  private fibersBySurfaceId: {[key: string]: FiberNode} = {};
  private surfacesByNodeId: {[key: string]: ISurface} = {};

  register (fiber: FiberNode, instance: ISurface) {
    this.fibersBySurfaceId[instance.id] = fiber;
    this.surfacesByNodeId[fiber.id] = instance;
  }

  release (instance: ISurface) {
    const fiber = this.findFiberBySurface(instance);
    delete this.fibersBySurfaceId[instance.id];
    delete this.surfacesByNodeId[fiber.id];
  }

  findFiberByHostInstance (hostInstance: any): FiberNode {
    // HACK linear search is really suboptimal
    return Object.values(this.surfacesByNodeId)
      .find((surface) => surface.hostInstance === hostInstance);
  }

  findHostInstanceByFiber (fiber: FiberNode): any {
    return this.findSurfaceByFiber(fiber).hostInstance;
  }

  findFiberBySurface (instance: ISurface): FiberNode {
    return this.fibersBySurfaceId[instance.id];
  }

  findSurfaceByFiber (fiber: FiberNode): ISurface {
    return this.surfacesByNodeId[fiber.id];
  }
}
