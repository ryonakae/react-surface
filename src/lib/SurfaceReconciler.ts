import {SurfaceComponentTree} from './SurfaceComponentTree';
import {Surface, SurfaceRoot} from './Surface';
const createReconciler = require('react-reconciler');
const now = require('performance-now');

export function createSurfaceReconciler (
  root: SurfaceRoot,
  componentTree: SurfaceComponentTree,
  createInstance: (type: string) => Surface
): ReactReconciler<SurfaceRoot> {
  return createReconciler({
    getRootHostContext (root: SurfaceRoot): HostContext {
      return {};
    },

    getChildHostContext (parentContext: HostContext, type: string): HostContext {
      return {};
    },

    getPublicInstance (instance: Surface) {
      return instance;
    },

    prepareForCommit () {
      // noop
    },

    resetAfterCommit () {
      root.afterCommit();
    },

    createInstance (type: string, props: SurfaceProps, root: SurfaceRoot, context: HostContext, fiber: FiberNode) {
      const instance = createInstance(type);
      instance.updateProps(props);
      componentTree.register(fiber, instance);
      return instance;
    },

    appendInitialChild (parentInstance: Surface, child: Surface) {
      parentInstance.appendChild(child);
    },

    finalizeInitialChildren (instance: Surface, type: string, props: SurfaceProps, root: SurfaceRoot) {
      return false;
    },

    prepareUpdate (
      instance: Surface, type: string, oldProps: SurfaceProps,
      newProps: SurfaceProps, root: SurfaceRoot, context: HostContext
    ) {
      // TODO optimize: diff props
      return newProps;
    },

    shouldSetTextContent (type: string, props: SurfaceProps): boolean {
      return false;
    },

    shouldDeprioritizeSubtree (type: string, props: SurfaceProps): boolean {
      return !!props.hidden;
    },

    createTextInstance (text: string, root: SurfaceRoot, context: HostContext, fiber: FiberNode) {
      // noop
    },

    now: () => now(),

    useSyncScheduling: true,

    mutation: {
      commitMount (instance: Surface, type: string, newProps: SurfaceProps, fiber: FiberNode) {

      },

      commitUpdate (
        instance: Surface, payload: SurfaceProps, type: string,
        oldProps: SurfaceProps, newProps: SurfaceProps, fiber: FiberNode
      ) {
        instance.updateProps(payload);
      },

      resetTextContent (instance: Surface) {
        instance.textValue = '';
      },

      commitTextUpdate (element: Surface, oldText: string, newText: string) {
        element.textValue = newText;
      },

      appendChild (parentInstance: Surface, child: Surface) {
        parentInstance.appendChild(child);
      },

      appendChildToContainer (container: SurfaceRoot, child: Surface) {
        container.appendChild(child);
      },

      insertBefore (parentInstance: Surface, child: Surface, beforeChild: Surface) {
        parentInstance.insertBefore(child, beforeChild);
      },

      insertInContainerBefore (container: SurfaceRoot, child: Surface, beforeChild: Surface,) {
        container.insertBefore(child, beforeChild);
      },

      removeChild (parentInstance: Surface, child: Surface) {
        parentInstance.removeChild(child);
        componentTree.release(child);
        child.destroy();
      },

      removeChildFromContainer (container: SurfaceRoot, child: Surface) {
        container.removeChild(child);
        componentTree.release(child);
        child.destroy();
      },
    }
  });
}
