import { SurfaceStore } from './SurfaceStore';
import { Surface, SurfaceRoot } from './Surface';
import { ReactReconciler } from 'global';
export declare function createSurfaceReconciler(root: SurfaceRoot, store: SurfaceStore, createInstance: (root: SurfaceRoot, type: string) => Surface): ReactReconciler<SurfaceRoot>;
