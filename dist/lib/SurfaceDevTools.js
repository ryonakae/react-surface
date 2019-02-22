"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const custom_1 = require("mobx-react/custom");
const mobx_1 = require("mobx");
const Color = require("color");
let SurfaceDevTools = class SurfaceDevTools extends React.Component {
    constructor() {
        super(...arguments);
        this.isMinimized = true;
    }
    toggle() {
        this.isMinimized = !this.isMinimized;
    }
    render() {
        const style = Object.assign({}, this.props.style, styles.devTools);
        return (React.createElement("surface", Object.assign({}, style, { onClick: () => this.toggle() }), this.isMinimized ?
            React.createElement(ToggleButton, null) :
            React.createElement(SurfaceStats, { store: this.props.store })));
    }
};
__decorate([
    mobx_1.observable
], SurfaceDevTools.prototype, "isMinimized", void 0);
__decorate([
    mobx_1.action
], SurfaceDevTools.prototype, "toggle", null);
SurfaceDevTools = __decorate([
    custom_1.observer
], SurfaceDevTools);
exports.SurfaceDevTools = SurfaceDevTools;
const ToggleButton = () => (React.createElement("surface", null, "SurfaceDevTools"));
let SurfaceStats = class SurfaceStats extends React.Component {
    render() {
        return (React.createElement("surface", null,
            "surfaces: ",
            this.props.store.surfaceCount,
            "tweens: ",
            this.props.store.tweenCount));
    }
};
SurfaceStats = __decorate([
    custom_1.observer
], SurfaceStats);
const styles = {
    devTools: {
        color: Color.rgb('#000000'),
        backgroundColor: Color.rgb('#ffffff'),
        padding: 10,
        borderRadius: 10
    }
};
