"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const events_1 = require("./events");
const YogaHelpers_1 = require("./YogaHelpers");
const Tween_1 = require("./tween/Tween");
const TweenInstruction_1 = require("./tween/TweenInstruction");
const lodash_1 = require("lodash");
const helpers_1 = require("./helpers");
const SurfaceEffects_1 = require("./SurfaceEffects");
const yoga = require('yoga-layout');
class Surface {
    constructor(root, type, container) {
        this.mutableChildren = [];
        this.textStyleGetters = {};
        this.tweens = {};
        this.props = {};
        this.root = root;
        this.yogaNode = yoga.Node.create();
        if (type === 'text') {
            this.yogaNode.setMeasureFunc(this.measureText.bind(this));
            this.pixiText = new PIXI.Text();
            this.pixiContainer = this.pixiText;
        }
        else {
            this.pixiContainer = container || new pixi_js_1.Container();
            this.childContainer = new pixi_js_1.Container();
            this.childContainer.name = 'children';
            this.pixiContainer.addChild(this.childContainer);
        }
        this.pixiContainer.name = type;
    }
    destroy() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
        for (const child of this.children) {
            child.destroy();
        }
        while (this.yogaNode.getChildCount()) {
            this.yogaNode.removeChild(this.yogaNode.getChild(0));
        }
        this.yogaNode.reset();
        this.pixiContainer.destroy();
        this.isDestroyed = true;
        this.root.surfacesWithTweens.delete(this.id);
    }
    get children() {
        return Object.freeze(this.mutableChildren.slice());
    }
    get hostInstance() {
        return this.pixiContainer;
    }
    get cascadedTextStyle() {
        const textStyle = {};
        for (const key in this.textStyleGetters) {
            const value = this.textStyleGetters[key]();
            if (value !== undefined) {
                textStyle[key] = value;
            }
        }
        return textStyle;
    }
    get tweenableProps() {
        return new Proxy(this.tweens, {
            get: (target, key) => {
                return this.tweens.hasOwnProperty(key) ?
                    this.tweens[key] :
                    { value: this.props[key] };
            }
        });
    }
    measureText() {
        const measurement = pixi_js_1.TextMetrics.measureText(this.pixiText.text, new pixi_js_1.TextStyle(this.cascadedTextStyle));
        return {
            width: measurement.maxLineWidth,
            height: measurement.lines.length * measurement.lineHeight
        };
    }
    updateProps(deltaProps = {}) {
        const prevProps = this.props;
        this.props = Object.assign({}, this.props, deltaProps);
        this.updateMount();
        this.updateEvents(prevProps, this.props);
        this.updateTweenableProps(prevProps, this.props);
        this.cascadeTextStyleGetters(); // TODO only cascade on text style changes
        this.updateYoga();
    }
    updateEvents(prevProps, nextProps) {
        const { removed, added, changed } = events_1.diffEventProps(prevProps, nextProps);
        for (const name in removed) {
            this.removeEventListener(name, removed[name]);
        }
        for (const name in changed) {
            const [prevHandler, nextHandler] = changed[name];
            this.removeEventListener(name, prevHandler);
            this.addEventListener(name, nextHandler);
        }
        for (const name in added) {
            this.addEventListener(name, added[name]);
        }
        this.pixiContainer.interactive = !!this.pixiContainer.eventNames()
            .find((name) => events_1.pixiEvents[String(name)].isInteractive);
    }
    updateTweenableProps(prevProps, nextProps) {
        const keys = lodash_1.uniq(Object.keys(prevProps).concat(Object.keys(nextProps)));
        for (const key of keys) {
            const prev = prevProps[key];
            const next = nextProps[key];
            let tween = this.tweens[key];
            if (next instanceof TweenInstruction_1.default) {
                if (prev instanceof Tween_1.Tween) {
                    tween = undefined;
                }
                // Mount
                if (!tween) {
                    tween = new Tween_1.Tween(next.to, next.options);
                    tween.instruct(next);
                    this.tweens[key] = tween;
                }
                else if (!next.equals(tween.lastInstruction)) {
                    tween.instruct(next);
                }
                continue;
            }
            if (next instanceof Tween_1.Tween) {
                this.tweens[key] = next;
                continue;
            }
            if (tween && prev instanceof TweenInstruction_1.default) {
                tween.stop();
            }
        }
        if (Object.keys(this.tweens).length > 0) {
            this.root.surfacesWithTweens.set(this.id, this);
        }
        else {
            this.root.surfacesWithTweens.delete(this.id);
        }
    }
    createTextStyleGetters() {
        return {
            wordWrap: () => this.props.wordWrap,
            align: () => this.props.textAlign,
            letterSpacing: () => this.tweenableProps.letterSpacing.value,
            fontFamily: () => this.props.fontFamily,
            fontSize: () => this.tweenableProps.fontSize.value,
            fontStyle: () => this.props.fontStyle,
            fontWeight: () => this.props.fontWeight,
            fill: () => {
                const color = this.tweenableProps.color.value;
                return color && color.rgbNumber();
            },
        };
    }
    cascadeTextStyleGetters() {
        const parentGetters = this.parentNode ? this.parentNode.textStyleGetters : {};
        this.textStyleGetters = this.createTextStyleGetters();
        for (const key in this.textStyleGetters) {
            const getter = this.textStyleGetters[key];
            const parentGetter = parentGetters[key];
            const value = getter();
            const parentValue = parentGetter && parentGetter();
            if (value === undefined && parentValue !== undefined) {
                this.textStyleGetters[key] = parentGetter;
            }
        }
        for (const child of this.children) {
            child.cascadeTextStyleGetters();
        }
    }
    updateYoga() {
        const yogaNode = this.yogaNode;
        for (const key in this.props) {
            const transformer = YogaHelpers_1.getYogaValueTransformer(key);
            const setFn = yogaNode[transformer.functionName];
            if (setFn) {
                const value = this.tweenableProps[key].value;
                const args = transformer.transform(value);
                setFn.apply(yogaNode, args);
            }
        }
    }
    updateMount() {
        mount(this.pixiContainer, this.props.backgroundColor !== undefined, () => this.backgroundColor, (value) => this.backgroundColor = value, () => new SurfaceEffects_1.SurfaceBackground(), () => this.backgroundImage || this.border || this.childContainer);
        mount(this.pixiContainer, this.props.backgroundImage !== undefined, () => this.backgroundImage, (value) => this.backgroundImage = value, () => new SurfaceEffects_1.SurfaceImage(), () => this.border || this.childContainer);
        mount(this.pixiContainer, SurfaceEffects_1.SurfaceBorder.getWidths(this.tweenableProps).find((w) => w > 0), () => this.border, (value) => this.border = value, () => new SurfaceEffects_1.SurfaceBorder(), () => this.childContainer);
        const needsMask = this.props.overflow === 'hidden' ||
            this.props.backgroundImage !== undefined ||
            (this.props.backgroundColor !== undefined && this.props.borderRadius !== undefined);
        mount(this.pixiContainer, needsMask, () => this.mask, (value) => this.mask = value, () => {
            const mask = new SurfaceEffects_1.SurfaceBorder();
            mask.name = 'mask';
            return mask;
        }, () => this.childContainer);
        if (this.pixiText) {
            if (this.pixiText.text !== this.textValue) {
                this.yogaNode.markDirty();
                this.pixiText.text = this.textValue;
            }
        }
    }
    updatePixi() {
        const layout = this.yogaNode.getComputedLayout();
        if (!this.layout || layout.width !== this.layout.width || layout.height !== this.layout.height) {
            this.emitEvent('onSizeChanged', layout);
        }
        this.layout = layout;
        this.pixiContainer.rotation = this.tweenableProps.rotation.value || 0;
        this.pixiContainer.skew.set(helpers_1.definedOr(this.tweenableProps.skewX.value, 0), helpers_1.definedOr(this.tweenableProps.skewY.value, 0));
        this.pixiContainer.scale.set(helpers_1.definedOr(this.tweenableProps.scaleX.value, 1), helpers_1.definedOr(this.tweenableProps.scaleY.value, 1));
        this.pixiContainer.pivot.set(helpers_1.definedOr(this.tweenableProps.pivotX.value, layout.width / 2), helpers_1.definedOr(this.tweenableProps.pivotY.value, layout.height / 2));
        this.pixiContainer.position.set(layout.left + helpers_1.definedOr(this.tweenableProps.translateX.value, 0) + this.pixiContainer.pivot.x, layout.top + helpers_1.definedOr(this.tweenableProps.translateY.value, 0) + this.pixiContainer.pivot.y);
        if (this.pixiText) {
            Object.assign(this.pixiText.style, this.cascadedTextStyle);
        }
        if (this.backgroundColor) {
            this.backgroundColor.color = this.tweenableProps.backgroundColor.value;
            this.backgroundColor.scale.set(layout.width, layout.height);
            this.backgroundColor.mask = this.mask;
        }
        if (this.backgroundImage) {
            this.backgroundImage.update(layout, this.tweenableProps);
            this.backgroundImage.mask = this.mask;
            // TODO centralized loader
            if (this.backgroundImage.texture.baseTexture.isLoading) {
                this.backgroundImage.texture.baseTexture.on('loaded', () => {
                    if (!this.isDestroyed) {
                        this.updatePixi();
                    }
                });
            }
        }
        if (this.mask) {
            this.mask.update(layout, this.tweenableProps);
        }
        if (this.border) {
            this.border.update(layout, this.tweenableProps);
        }
        this.pixiContainer.mask = (this.props.overflow === 'hidden' ? this.mask : undefined);
        this.pixiContainer.alpha = helpers_1.definedOr(this.tweenableProps.opacity.value, 1);
    }
    appendChild(child) {
        if (!child) {
            return;
        }
        this.childContainer.addChild(child.pixiContainer);
        this.yogaNode.insertChild(child.yogaNode, this.mutableChildren.length);
        this.mutableChildren.push(child);
        child.parentNode = this;
        child.cascadeTextStyleGetters();
    }
    insertBefore(child, beforeChild) {
        if (!child) {
            return;
        }
        let index = this.childContainer.getChildIndex(beforeChild.pixiContainer);
        this.childContainer.addChildAt(child.pixiContainer, index);
        this.yogaNode.insertChild(child.yogaNode, index);
        index = this.mutableChildren.indexOf(beforeChild);
        this.mutableChildren.splice(index, 0, child);
        child.parentNode = this;
        child.cascadeTextStyleGetters();
    }
    removeChild(child) {
        if (!child) {
            return;
        }
        if (child.parentNode !== this) {
            throw new Error('Cannot remove child. Argument is not a child of this surface');
        }
        this.yogaNode.removeChild(child.yogaNode);
        this.childContainer.removeChild(child.pixiContainer);
        const index = this.mutableChildren.indexOf(child);
        this.mutableChildren.splice(index, 1);
        child.parentNode = undefined;
    }
    addEventListener(name, handler) {
        this.pixiContainer.addListener(events_1.surfaceEvents[name].pixiName, handler);
    }
    removeEventListener(name, handler) {
        this.pixiContainer.removeListener(events_1.surfaceEvents[name].pixiName, handler);
    }
    emitEvent(name, ...args) {
        this.pixiContainer.emit(events_1.surfaceEvents[name].pixiName, ...args);
    }
}
exports.Surface = Surface;
class SurfaceRoot extends Surface {
    constructor(target, store) {
        const app = new pixi_js_1.Application(target.clientWidth, target.clientHeight, {
            transparent: true,
            antialias: true
        });
        target.appendChild(app.view);
        super(undefined, 'root', app.stage);
        this.root = this;
        this.store = store;
        this.surfacesWithTweens = new Map();
        this.target = target;
        this.app = app;
        this.app.ticker.add(this.updateTweens.bind(this));
        this.updateBounds();
        if (typeof window !== undefined) {
            window.addEventListener('resize', this.updateBounds.bind(this));
        }
    }
    destroy() {
        super.destroy();
        this.app.destroy(true);
    }
    afterCommit() {
        this.applyLayout();
    }
    applyLayout() {
        this.yogaNode.calculateLayout(this.app.view.width, this.app.view.height, yoga.DIRECTION_LTR);
        const queue = [this];
        while (queue.length) {
            const next = queue.pop();
            next.updatePixi();
            queue.push(...next.children);
        }
    }
    updateTweens() {
        const activeTweens = Tween_1.Tween.update();
        this.store.updateTweenCount(activeTweens.length);
        // TODO optimize: only apply layout when yoga values have been changed
        if (this.surfacesWithTweens.size) {
            this.applyLayout();
        }
        for (const surface of this.surfacesWithTweens.values()) {
            // HACK shouldn't have to check this, destroyed surfaces shouldn't be here
            if (!surface.isDestroyed) {
                surface.updateYoga();
                surface.updatePixi();
            }
        }
    }
    updateBounds() {
        this.app.renderer.resize(this.target.clientWidth, this.target.clientHeight);
        this.applyLayout();
    }
}
exports.SurfaceRoot = SurfaceRoot;
function mount(container, shouldBeMounted, getter, setter, creator, before) {
    let obj = getter();
    if (shouldBeMounted) {
        if (!obj) {
            obj = creator();
            setter(obj);
            container.addChildAt(obj, container.getChildIndex(before()));
        }
    }
    else {
        if (obj) {
            container.removeChild(obj);
            setter(undefined);
        }
    }
}
