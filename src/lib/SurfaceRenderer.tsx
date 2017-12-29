import {ReactElement} from 'react';
import {createSurfaceReconciler} from './SurfaceReconciler';
import {SurfaceStore} from './SurfaceStore';
import {Surface, SurfaceRoot} from './Surface';

export class SurfaceRenderer {
  public readonly container?: ReactContainer<SurfaceRoot>;
  public readonly reconciler: ReactReconciler<SurfaceRoot>;
  public readonly store: SurfaceStore;
  public readonly root: SurfaceRoot;

  constructor (target: HTMLElement) {
    this.store = new SurfaceStore();
    this.root = new SurfaceRoot(target, this.store);

    this.reconciler = createSurfaceReconciler(
      this.root, this.store, (root, type) => new Surface(root, type)
    );

    this.reconciler.injectIntoDevTools({
      bundleType: 1, // 0 for PROD, 1 for DEV
      version: '0.1.0', // version for your renderer
      rendererPackageName: 'react-surface', // package name
      findFiberByHostInstance: this.store.findFiberByHostInstance.bind(this.store)
    });

    this.container = this.reconciler.createContainer(this.root);
  }

  render<P> (element: ReactElement<P>) {
    this.reconciler.updateContainer(element, this.container);
    return this.container.containerInfo.children[0];
  }

  unmount () {
    this.root.destroy();
  }
}
