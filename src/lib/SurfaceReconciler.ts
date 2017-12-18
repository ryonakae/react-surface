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

export function createSurfaceReconciler<TRoot extends ISurfaceRoot> (
  componentTree: SurfaceComponentTree,
  createInstance: (props: SurfaceProps, type: string, root: TRoot) => ISurface
): ReactReconciler<TRoot> {
  return createReconciler(
    logMonkeyPatchObject(['SurfaceReconciler'], {
      getRootHostContext (root: TRoot): HostContext {
        return {};
      },

      getChildHostContext (parentContext: HostContext, type: string): HostContext {
        return {};
      },

      getPublicInstance (instance: ISurface) {
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
        const instance = createInstance(props, type, root);
        componentTree.register(fiber, instance);
        return instance;
      },

      appendInitialChild (parentInstance: ISurface, child: ISurface) {
        parentInstance.appendChild(child);
      },

      finalizeInitialChildren (instance: ISurface, type: string, props: SurfaceProps, root: TRoot) {
        return false;
      },

      prepareUpdate (
        instance: ISurface, type: string, oldProps: SurfaceProps,
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
        const instance = createInstance({}, 'text', root);
        instance.textValue = text;
        componentTree.register(fiber, instance);
        return instance;
      },

      now: () => now(),

      useSyncScheduling: true,

      mutation: {
        commitMount (instance: ISurface, type: string, newProps: SurfaceProps, fiber: FiberNode) {

        },

        commitUpdate (
          instance: ISurface, payload: SurfaceProps, type: string,
          oldProps: SurfaceProps, newProps: SurfaceProps, fiber: FiberNode
        ) {
          instance.updateProps(payload);
        },

        resetTextContent (instance: ISurface) {
          instance.textValue = '';
        },

        commitTextUpdate (element: ISurface, oldText: string, newText: string) {
          element.textValue = newText;
        },

        appendChild (parentInstance: ISurface, child: ISurface) {
          parentInstance.appendChild(child);
        },

        appendChildToContainer (container: TRoot, child: ISurface) {
          container.appendChild(child);
        },

        insertBefore (parentInstance: ISurface, child: ISurface, beforeChild: ISurface) {
          parentInstance.insertBefore(child, beforeChild);
        },

        insertInContainerBefore (container: TRoot, child: ISurface, beforeChild: ISurface,) {
          container.insertBefore(child, beforeChild);
        },

        removeChild (parentInstance: ISurface, child: ISurface) {
          parentInstance.removeChild(child);
          componentTree.release(child);
        },

        removeChildFromContainer (container: TRoot, child: ISurface) {
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
