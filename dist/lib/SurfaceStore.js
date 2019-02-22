"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
class SurfaceStore {
    constructor() {
        this.idCounter = 0;
        this.fibersBySurfaceId = new Map();
        this.surfacesByFiberId = new Map();
        this.tweenCount = 0;
    }
    get surfaceCount() {
        return Array.from(this.surfacesByFiberId.keys()).length;
    }
    getNexSurfaceId() {
        const nextId = this.idCounter;
        this.idCounter += 1;
        return nextId;
    }
    register(fiber, surface) {
        surface.id = this.getNexSurfaceId();
        this.fibersBySurfaceId.set(surface.id, fiber);
        this.surfacesByFiberId.set(fiber._debugID, surface);
    }
    release(surface) {
        const fiber = this.fibersBySurfaceId.get(surface.id);
        this.surfacesByFiberId.delete(fiber._debugID);
        this.fibersBySurfaceId.delete(surface.id);
    }
    updateTweenCount(count) {
        this.tweenCount = count;
    }
    findFiberByHostInstance(hostInstance) {
        // TODO optimize: don't do linear search
        const surface = Object.values(this.surfacesByFiberId)
            .find((surface) => surface.hostInstance === hostInstance);
        if (surface) {
            return this.findFiberBySurface(surface);
        }
    }
    findHostInstanceByFiber(fiber) {
        return this.findSurfaceByFiber(fiber).hostInstance;
    }
    findFiberBySurface(instance) {
        return this.fibersBySurfaceId.get(instance.id);
    }
    findSurfaceByFiber(fiber) {
        return this.surfacesByFiberId.get(fiber._debugID);
    }
}
__decorate([
    mobx_1.observable
], SurfaceStore.prototype, "fibersBySurfaceId", void 0);
__decorate([
    mobx_1.observable
], SurfaceStore.prototype, "surfacesByFiberId", void 0);
__decorate([
    mobx_1.observable
], SurfaceStore.prototype, "tweenCount", void 0);
__decorate([
    mobx_1.computed
], SurfaceStore.prototype, "surfaceCount", null);
__decorate([
    mobx_1.action
], SurfaceStore.prototype, "register", null);
__decorate([
    mobx_1.action
], SurfaceStore.prototype, "release", null);
__decorate([
    mobx_1.action
], SurfaceStore.prototype, "updateTweenCount", null);
exports.SurfaceStore = SurfaceStore;
