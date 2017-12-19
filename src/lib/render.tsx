import {ReactElement} from 'react';
import {createSurfaceReconciler} from './SurfaceReconciler';
import {SurfaceComponentTree} from './SurfaceComponentTree';
import {DOMSurface, DOMSurfaceRoot} from './DOMSurface';

const componentTree = new SurfaceComponentTree();
const reconciler = createSurfaceReconciler<DOMSurfaceRoot, DOMSurface>(
  componentTree,
  (type, root) => new DOMSurface(type === 'text', root)
);

export function render<P> (element: ReactElement<P>, target: HTMLElement) {
  reconciler.injectIntoDevTools({
    bundleType: 1, // 0 for PROD, 1 for DEV
    version: '0.1.0', // version for your renderer
    rendererPackageName: 'react-surface', // package name
    findFiberByHostInstance: componentTree.findFiberByHostInstance.bind(componentTree)
  });

  const rootContainer = (target as any)._reactRootContainer || (
    (target as any)._reactRootContainer = reconciler.createContainer(new DOMSurfaceRoot(target))
  );

  reconciler.updateContainer(element, rootContainer);

  return rootContainer.containerInfo;
}
