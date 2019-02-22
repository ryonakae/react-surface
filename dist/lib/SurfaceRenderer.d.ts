import { ReactElement } from 'react';
import { SurfaceStore } from './SurfaceStore';
import { Surface, SurfaceRoot } from './Surface';
import { ReactContainer, ReactReconciler } from 'global';
export declare class SurfaceRenderer {
    readonly container: ReactContainer<SurfaceRoot>;
    readonly reconciler: ReactReconciler<SurfaceRoot>;
    readonly store: SurfaceStore;
    readonly root: SurfaceRoot;
    constructor(target: HTMLElement);
    render<P>(element: ReactElement<P>): Surface;
    unmount(): void;
}
