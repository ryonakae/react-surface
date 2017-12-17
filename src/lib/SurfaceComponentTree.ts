export class SurfaceComponentTree {
  private nodesBySurfaceId: {[key: string]: FiberNode} = {};
  private surfacesByNodeId: {[key: string]: ISurface} = {};

  register (node: FiberNode, instance: ISurface) {
    this.nodesBySurfaceId[instance.id] = node;
    this.surfacesByNodeId[node.id] = instance;
  }

  release (instance: ISurface) {
    const fiber = this.getFiberNodeFromSurface(instance);
    delete this.nodesBySurfaceId[instance.id];
    delete this.surfacesByNodeId[fiber.id];
  }

  getFiberNodeFromSurface (instance: ISurface) {
    return this.nodesBySurfaceId[instance.id];
  }

  getSurfaceFromFiberNode (node: FiberNode) {
    return this.surfacesByNodeId[node.id];
  }
}
