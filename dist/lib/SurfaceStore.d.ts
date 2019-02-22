import { Surface } from './Surface';
import { FiberNode } from 'global';
export declare class SurfaceStore {
    private idCounter;
    private fibersBySurfaceId;
    private surfacesByFiberId;
    tweenCount: number;
    readonly surfaceCount: number;
    getNexSurfaceId(): number;
    register(fiber: FiberNode, surface: Surface): void;
    release(surface: Surface): void;
    updateTweenCount(count: number): void;
    findFiberByHostInstance(hostInstance: any): FiberNode;
    findHostInstanceByFiber(fiber: FiberNode): any;
    findFiberBySurface(instance: Surface): FiberNode;
    findSurfaceByFiber(fiber: FiberNode): Surface;
}
