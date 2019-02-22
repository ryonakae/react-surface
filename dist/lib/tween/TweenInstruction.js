"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
class TweenInstructionProps {
    constructor(props = {}) {
        Object.assign(this, props);
        this.props = props;
    }
}
exports.TweenInstructionProps = TweenInstructionProps;
class TweenInstruction extends TweenInstructionProps {
    get arithmetic() {
        return settings_1.getArithmetic(this.props.to || this.props.from);
    }
    extend(ext) {
        const { options } = ext, props = __rest(ext, ["options"]);
        const extended = new TweenInstruction(Object.assign({}, this.props, props));
        extended.options = this.options ? this.options.extend(options) : options;
        return extended;
    }
    equals(other) {
        if (!other) {
            return false;
        }
        if (this.options && other.options) {
            if (!this.options.equals(other.options)) {
                return false;
            }
        }
        else if (this.options || other.options) {
            return false;
        }
        return this.from === other.from &&
            this.to === other.to &&
            this.speed === other.speed;
    }
}
exports.default = TweenInstruction;
