"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const constants_1 = require("./constants");
const helpers_1 = require("./helpers");
class SurfaceBackground extends pixi_js_1.Graphics {
    constructor() {
        super(...arguments);
        this.currentColor = constants_1.commonColors.transparent;
    }
    set color(value) {
        if (value === undefined) {
            value = constants_1.commonColors.transparent;
        }
        if (this.currentColor.toString() === value.toString()) {
            return;
        }
        this.currentColor = value;
        this.clear();
        this.beginFill(value.rgbNumber(), value.alpha());
        this.drawRect(0, 0, 1, 1);
        this.endFill();
    }
}
exports.SurfaceBackground = SurfaceBackground;
class SurfaceImage extends pixi_js_1.Sprite {
    update(containerSize, props) {
        if (props.backgroundImage.value) {
            this.texture = PIXI.Texture.fromImage(props.backgroundImage.value);
        }
        this.alpha = helpers_1.definedOr(props.backgroundOpacity.value, 1);
        this.resize(containerSize, props.backgroundPosition.value, props.backgroundSize.value);
    }
    resize(container, position = ['50%', '50%'], size = 'contain') {
        const containerRatio = container.width / container.height;
        const spriteRatio = this.texture.width / this.texture.height;
        let scaleX = 1;
        let scaleY = 1;
        // Determine scale
        let percentage;
        if (typeof size === 'string') {
            const p = this.getPercentage(size, -1);
            if (p !== -1) {
                percentage = { x: p, y: p };
            }
            else if (size === 'cover' ? (containerRatio > spriteRatio) : (containerRatio < spriteRatio)) {
                scaleX = scaleY = container.width / this.texture.width;
            }
            else {
                scaleX = scaleY = container.height / this.texture.height;
            }
        }
        else if (Array.isArray(size)) {
            percentage = {
                x: this.getPercentage(size[0]),
                y: this.getPercentage(size[1])
            };
        }
        else {
            const p = this.getPercentage(size);
            percentage = { x: p, y: p };
        }
        if (percentage !== undefined) {
            scaleX = percentage.x * container.width / this.texture.width;
            scaleY = percentage.y * container.height / this.texture.height;
        }
        // Determine position
        const xPositionPercentage = this.getPercentage(position[0], -1);
        const yPositionPercentage = this.getPercentage(position[1], -1);
        this.position.set(xPositionPercentage !== -1 ?
            -(this.texture.width * scaleX - container.width) * xPositionPercentage :
            position[0], yPositionPercentage !== -1 ?
            -(this.texture.height * scaleY - container.height) * yPositionPercentage :
            position[1]);
        this.scale.set(scaleX, scaleY);
    }
    getPercentage(value, fallbackValue) {
        if (typeof value === 'string') {
            const percentageMatch = /(.*?)%$/.exec(value);
            if (percentageMatch) {
                return parseFloat(percentageMatch[1]) / 100;
            }
        }
        if (fallbackValue === undefined) {
            throw new Error('Could not get percentage');
        }
        return fallbackValue;
    }
}
exports.SurfaceImage = SurfaceImage;
class SurfaceBorder extends pixi_js_1.Graphics {
    static getWidths(props) {
        const borderAll = helpers_1.definedOr(props.border.value, 0);
        return [
            helpers_1.definedOr(props.borderTop.value, borderAll),
            helpers_1.definedOr(props.borderRight.value, borderAll),
            helpers_1.definedOr(props.borderBottom.value, borderAll),
            helpers_1.definedOr(props.borderLeft.value, borderAll)
        ];
    }
    update(size, props) {
        const borderWidths = SurfaceBorder.getWidths(props);
        const borderColorAll = helpers_1.definedOr(props.borderColor.value, constants_1.commonColors.transparent);
        const borderColors = [
            helpers_1.definedOr(props.borderColorTop.value, borderColorAll),
            helpers_1.definedOr(props.borderColorRight.value, borderColorAll),
            helpers_1.definedOr(props.borderColorBottom.value, borderColorAll),
            helpers_1.definedOr(props.borderColorLeft.value, borderColorAll)
        ];
        if (props.borderRadius.value > 0) {
            const firstWidth = borderWidths.find((w) => w > 0) || 0;
            const firstColor = borderColors.find((c) => c !== undefined);
            this.drawRadius(size, firstWidth, firstColor, props.borderRadius.value);
        }
        else {
            this.drawSquare(size, borderWidths, borderColors);
        }
    }
    drawSquare(size, widths, colors) {
        this.clear();
        // Fill (for masking)
        this.beginFill(constants_1.commonColors.transparent.rgbNumber(), constants_1.commonColors.transparent.alpha());
        this.drawRect(0, 0, size.width, size.height);
        this.endFill();
        // Top
        this.beginFill(colors[0].rgbNumber(), colors[0].alpha());
        this.drawRect(0, 0, size.width, widths[0]);
        this.endFill();
        // Right
        this.beginFill(colors[1].rgbNumber(), colors[1].alpha());
        this.drawRect(size.width - widths[1], widths[0], widths[1], size.height - widths[0] - widths[2]);
        this.endFill();
        // Bottom
        this.beginFill(colors[2].rgbNumber(), colors[2].alpha());
        this.drawRect(0, size.height - widths[2], size.width, widths[2]);
        this.endFill();
        // Right
        this.beginFill(colors[3].rgbNumber(), colors[3].alpha());
        this.drawRect(0, widths[0], widths[1], size.height - widths[0] - widths[2]);
        this.endFill();
    }
    drawRadius(size, width, color, radius) {
        const offset = width / 2;
        this.clear();
        this.lineStyle(width, color.rgbNumber(), color.alpha());
        this.beginFill(constants_1.commonColors.transparent.rgbNumber(), constants_1.commonColors.transparent.alpha());
        this.drawRoundedRect(offset, offset, size.width - offset * 2, size.height - offset * 2, radius);
        this.endFill();
    }
}
exports.SurfaceBorder = SurfaceBorder;
