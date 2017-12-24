import {ReactElement} from 'react';
import {createSurfaceReconciler} from './SurfaceReconciler';
import {SurfaceComponentTree} from './SurfaceComponentTree';
import {Surface, SurfaceRoot} from './Surface';

export type SurfaceRenderMemory = {
  tree?: SurfaceComponentTree,
  root?: SurfaceRoot
  container?: ReactContainer<SurfaceRoot>
};

export function render<P> (element: ReactElement<P>, target: HTMLElement, memory: SurfaceRenderMemory = {}) {
  if (!memory.tree) {
    memory.tree = new SurfaceComponentTree();
    memory.root = new SurfaceRoot(target);
  }

  const reconciler = createSurfaceReconciler(
    memory.root,
    memory.tree,
    (type) => new Surface(type === 'text')
  );

  reconciler.injectIntoDevTools({
    bundleType: 1, // 0 for PROD, 1 for DEV
    version: '0.1.0', // version for your renderer
    rendererPackageName: 'react-surface', // package name
    findFiberByHostInstance: memory.tree.findFiberByHostInstance.bind(memory.tree)
  });

  if (!memory.container) {
    memory.container = reconciler.createContainer(memory.root);
  }

  reconciler.updateContainer(element, memory.container);

  return memory.container;
}
