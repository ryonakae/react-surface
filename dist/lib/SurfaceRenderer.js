"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SurfaceReconciler_1 = require("./SurfaceReconciler");
const SurfaceStore_1 = require("./SurfaceStore");
const Surface_1 = require("./Surface");
class SurfaceRenderer {
    constructor(target) {
        this.store = new SurfaceStore_1.SurfaceStore();
        this.root = new Surface_1.SurfaceRoot(target, this.store);
        this.reconciler = SurfaceReconciler_1.createSurfaceReconciler(this.root, this.store, (root, type) => new Surface_1.Surface(root, type));
        this.reconciler.injectIntoDevTools({
            bundleType: 1,
            version: '0.1.0',
            rendererPackageName: 'react-surface',
            findFiberByHostInstance: this.store.findFiberByHostInstance.bind(this.store)
        });
        this.container = this.reconciler.createContainer(this.root);
    }
    render(element) {
        this.reconciler.updateContainer(element, this.container);
        return this.container.containerInfo.children[0];
    }
    unmount() {
        this.root.destroy();
    }
}
exports.SurfaceRenderer = SurfaceRenderer;
