"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const createReconciler = require('react-reconciler');
const now = require('performance-now');
function createSurfaceReconciler(root, store, createInstance) {
    return createReconciler({
        getRootHostContext(root) {
            return {};
        },
        getChildHostContext(parentContext, type) {
            return {};
        },
        getPublicInstance(instance) {
            return instance;
        },
        prepareForCommit() {
            // noop
        },
        resetAfterCommit() {
            root.afterCommit();
        },
        createInstance(type, props, root, context, fiber) {
            const instance = createInstance(root, type);
            instance.updateProps(props);
            store.register(fiber, instance);
            return instance;
        },
        appendInitialChild(parentInstance, child) {
            parentInstance.appendChild(child);
        },
        finalizeInitialChildren(instance, type, props, root) {
            return false;
        },
        prepareUpdate(instance, type, oldProps, newProps, root, context) {
            // TODO optimize: diff props
            const prevProps = Object.assign({}, instance.props);
            const nextProps = Object.assign({}, newProps);
            delete prevProps.children;
            delete nextProps.children;
            const changes = diff(prevProps, nextProps);
            if (Object.keys(changes).length > 0) {
                return changes;
            }
        },
        shouldSetTextContent(type, props) {
            return false;
        },
        shouldDeprioritizeSubtree(type, props) {
            return !!props.hidden;
        },
        createTextInstance(text, root, context, fiber) {
            const instance = createInstance(root, 'text');
            instance.textValue = text;
            instance.updateProps();
            store.register(fiber, instance);
            return instance;
        },
        now: () => now(),
        useSyncScheduling: true,
        mutation: {
            commitMount(instance, type, newProps, fiber) {
            },
            commitUpdate(instance, payload, type, oldProps, newProps, fiber) {
                instance.updateProps(payload);
            },
            resetTextContent(instance) {
                instance.textValue = undefined;
                instance.updateProps();
            },
            commitTextUpdate(instance, oldText, newText) {
                instance.textValue = newText;
                instance.updateProps();
            },
            appendChild(parentInstance, child) {
                parentInstance.appendChild(child);
            },
            appendChildToContainer(container, child) {
                container.appendChild(child);
            },
            insertBefore(parentInstance, child, beforeChild) {
                parentInstance.insertBefore(child, beforeChild);
            },
            insertInContainerBefore(container, child, beforeChild) {
                container.insertBefore(child, beforeChild);
            },
            removeChild(parentInstance, child) {
                parentInstance.removeChild(child);
                // Release child and its sub tree
                const queue = [child];
                while (queue.length) {
                    const next = queue.pop();
                    store.release(next);
                    queue.push(...next.children);
                }
                child.destroy();
            },
            removeChildFromContainer(container, child) {
                container.removeChild(child);
                store.release(child);
                child.destroy();
            }
        }
    });
}
exports.createSurfaceReconciler = createSurfaceReconciler;
function diff(a, b) {
    const propertyNames = lodash_1.uniq(Object.keys(a).concat(Object.keys(b)));
    const changes = {};
    for (const name of propertyNames) {
        const prev = a[name];
        const next = b[name];
        if (prev && next) {
            if (prev !== next) {
                changes[name] = next;
            }
        }
        else if (prev && !next) {
            changes[name] = undefined;
        }
        else if (!prev && next) {
            changes[name] = next;
        }
    }
    return changes;
}
