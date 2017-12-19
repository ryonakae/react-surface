import * as React from 'react';
import {SurfaceComponentTree} from './SurfaceComponentTree';
import {isDirectTextChildProps} from './isDirectTextChildProps';
const createReconciler = require('react-reconciler');
const now = require('performance-now');

// Type shims
// TODO replace with types from react-reconciler when it's available

type HostContext = {};

export type ReactContainer<TRoot> = {
  containerInfo: TRoot
};

export type ReactReconciler<TRoot extends ISurfaceRoot> = {
  injectIntoDevTools (config: any): void;
  createContainer (root: TRoot): ReactContainer<TRoot>;
  updateContainer<P> (element: React.ReactElement<P>, container: ReactContainer<TRoot>): void;
};

export function createSurfaceReconciler<TRoot extends ISurfaceRoot, TSurface extends ISurface> (
  componentTree: SurfaceComponentTree,
  createInstance: (type: string, root: TRoot) => TSurface
): ReactReconciler<TRoot> {
  return createReconciler(
    logMonkeyPatchObject(['SurfaceReconciler'], {
      getRootHostContext (root: TRoot): HostContext {
        return {};
      },

      getChildHostContext (parentContext: HostContext, type: string): HostContext {
        return {};
      },

      getPublicInstance (instance: TSurface) {
        return instance;
      },

      prepareForCommit () {
        // eventsEnabled = ReactBrowserEventEmitter.isEnabled();
        // selectionInformation = ReactInputSelection.getSelectionInformation();
        // ReactBrowserEventEmitter.setEnabled(false);
      },

      resetAfterCommit () {
        // ReactInputSelection.restoreSelection(selectionInformation);
        // selectionInformation = null;
        // ReactBrowserEventEmitter.setEnabled(eventsEnabled);
        // eventsEnabled = null;
      },

      createInstance (type: string, props: SurfaceProps, root: TRoot, context: HostContext, fiber: FiberNode) {
        const instance = createInstance(type, root);
        instance.updateProps(props);
        componentTree.register(fiber, instance);
        return instance;
      },

      appendInitialChild (parentInstance: TSurface, child: TSurface) {
        parentInstance.appendChild(child);
      },

      finalizeInitialChildren (instance: TSurface, type: string, props: SurfaceProps, root: TRoot) {
        return false;
      },

      prepareUpdate (
        instance: TSurface, type: string, oldProps: SurfaceProps,
        newProps: SurfaceProps, root: TRoot, context: HostContext
      ) {
        return newProps;
      },

      shouldSetTextContent (type: string, props: SurfaceProps): boolean {
        return isDirectTextChildProps(props);
      },

      shouldDeprioritizeSubtree (type: string, props: SurfaceProps): boolean {
        return !!props.hidden;
      },

      createTextInstance (text: string, root: TRoot, context: HostContext, fiber: FiberNode) {
        const instance = createInstance('text', root);
        instance.textValue = text;
        componentTree.register(fiber, instance);
        return instance;
      },

      now: () => now(),

      useSyncScheduling: true,

      mutation: {
        commitMount (instance: TSurface, type: string, newProps: SurfaceProps, fiber: FiberNode) {

        },

        commitUpdate (
          instance: TSurface, payload: SurfaceProps, type: string,
          oldProps: SurfaceProps, newProps: SurfaceProps, fiber: FiberNode
        ) {
          instance.updateProps(payload);
        },

        resetTextContent (instance: TSurface) {
          instance.textValue = '';
        },

        commitTextUpdate (element: TSurface, oldText: string, newText: string) {
          element.textValue = newText;
        },

        appendChild (parentInstance: TSurface, child: TSurface) {
          parentInstance.appendChild(child);
        },

        appendChildToContainer (container: TRoot, child: TSurface) {
          container.appendChild(child);
        },

        insertBefore (parentInstance: TSurface, child: TSurface, beforeChild: TSurface) {
          parentInstance.insertBefore(child, beforeChild);
        },

        insertInContainerBefore (container: TRoot, child: TSurface, beforeChild: TSurface,) {
          container.insertBefore(child, beforeChild);
        },

        removeChild (parentInstance: TSurface, child: TSurface) {
          parentInstance.removeChild(child);
          componentTree.release(child);
        },

        removeChildFromContainer (container: TRoot, child: TSurface) {
          container.removeChild(child);
          componentTree.release(child);
        },
      }
    })
  );
}

function logMonkeyPatchObject (path: string[] = [], obj: any, recurse: boolean = true) {
  for (const key in obj) {
    if (key === 'now') {
      continue;
    }
    if (typeof obj[key] === 'function') {
      logMonkeyPatchFunction(obj, key, path);
    } else if (recurse && typeof obj[key] === 'object') {
      logMonkeyPatchObject(path.concat(key), obj[key], true);
    }
  }

  return obj;
}

function logMonkeyPatchFunction (obj: any, key: string, path: string[]) {
  const originalFunction = obj[key];
  const functionId = path.concat(key).join('.');
  obj[key] = function () {
    const cleanArgs = [...arguments];
    const printableArgs = cleanArgs.filter((arg) => typeof arg === 'string');
    console.info(functionId, ...printableArgs);
    return originalFunction(...cleanArgs);
  };
}
