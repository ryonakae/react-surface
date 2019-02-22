"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BezierEasing_1 = require("./BezierEasing");
class TweenOptionsProps {
    constructor(props = {}) {
        this.easing = BezierEasing_1.BezierEasing.presets.easeOut;
        this.delay = 0;
        this.duration = 1000;
        Object.assign(this, props);
        this.props = props;
    }
}
class TweenOptions extends TweenOptionsProps {
    extend(ext) {
        if (!ext || ext === this) {
            return this;
        }
        if (ext instanceof TweenOptions) {
            return new TweenOptions(Object.assign({}, this.props, ext.props));
        }
        return new TweenOptions(Object.assign({}, this.props, ext));
    }
    equals(other) {
        if (!other) {
            return false;
        }
        return this.duration === other.duration &&
            this.delay === other.delay &&
            this.easing.equals(other.easing);
    }
}
exports.TweenOptions = TweenOptions;
