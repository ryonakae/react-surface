import {Application, Container, Text, TextMetrics, TextStyle, DisplayObject, interaction} from 'pixi.js';
import {diffEventProps, pixiEvents, surfaceEvents} from './events';
import {getYogaValueTransformer} from './YogaHelpers';
import {Tween} from './tween/Tween';
import TweenInstruction from './tween/TweenInstruction';
import {uniq} from 'lodash';
import {definedOr, GettableProps, TweenableProps} from './helpers';
import {SurfaceBackground, SurfaceBorder, SurfaceImage} from './SurfaceEffects';
import {SurfaceStore} from './SurfaceStore';
import {YogaLayout, SurfaceProps, YogaNode} from 'global';

const yoga = require('yoga-layout');

export class Surface {
  private mutableChildren: Surface[] = [];

  protected pixiContainer: Container;
  private backgroundColor?: SurfaceBackground;
  private backgroundImage?: SurfaceImage;
  private border?: SurfaceBorder;
  private mask?: SurfaceBorder;
  private childContainer: Container;
  private pixiText?: Text;
  private layout?: YogaLayout;
  private textStyleGetters: GettableProps<PIXI.TextStyleOptions> = {};
  private tweens: TweenableProps<SurfaceProps> = {};

  public id: number;
  public isDestroyed: boolean;
  public yogaNode: YogaNode;
  public parentNode?: Surface;
  public props: SurfaceProps = {};
  public textValue?: string;
  public root: SurfaceRoot;

  constructor (
    root?: SurfaceRoot,
    type?: string,
    container?: Container
  ) {
    this.root = root!;
    this.yogaNode = yoga.Node.create();

    if (type === 'text') {
      this.yogaNode.setMeasureFunc(this.measureText.bind(this));
      this.pixiText = new PIXI.Text();
      this.pixiContainer = this.pixiText;
    } else {
      this.pixiContainer = container || new Container();
      this.childContainer = new Container();
      this.childContainer.name = 'children';
      this.pixiContainer.addChild(this.childContainer);
    }

    this.pixiContainer.name = type!;
  }

  destroy () {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }

    for (const child of this.children) {
      child.destroy();
    }

    while (this.yogaNode.getChildCount()) {
      this.yogaNode.removeChild(
        this.yogaNode.getChild(0)
      );
    }

    this.yogaNode.reset();
    this.pixiContainer.destroy();
    this.isDestroyed = true;
    this.root!.surfacesWithTweens.delete(this.id);
  }

  get children () {
    return Object.freeze(this.mutableChildren.slice());
  }

  get hostInstance () {
    return this.pixiContainer;
  }

  get cascadedTextStyle (): PIXI.TextStyleOptions {
    const textStyle = {};
    for (const key in this.textStyleGetters) {
      const value = (this.textStyleGetters as any)[key]();
      if (value !== undefined) {
        (textStyle as any)[key] = value;
      }
    }
    return textStyle;
  }

  get tweenableProps (): TweenableProps<SurfaceProps> {
    return new Proxy(this.tweens, {
      get: (target, key) => {
        return this.tweens.hasOwnProperty(key) ?
          (this.tweens as any)[key] :
            {value: (this.props as any)[key]};
      }
    });
  }

  measureText () {
    const measurement = TextMetrics.measureText(this.pixiText!.text, new TextStyle(this.cascadedTextStyle));
    return {
      width: measurement.maxLineWidth,
      height: measurement.lines.length * measurement.lineHeight
    };
  }

  updateProps (deltaProps: SurfaceProps = {}) {
    const prevProps = this.props;
    this.props = Object.assign({}, this.props, deltaProps);
    this.updateMount();
    this.updateEvents(prevProps, this.props);
    this.updateTweenableProps(prevProps, this.props);
    this.cascadeTextStyleGetters(); // TODO only cascade on text style changes
    this.updateYoga();
  }

  updateEvents (prevProps: SurfaceProps, nextProps: SurfaceProps) {
    const {removed, added, changed} = diffEventProps(prevProps, nextProps);

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
      .find((name) => pixiEvents[String(name)].isInteractive);
  }

  updateTweenableProps (prevProps: SurfaceProps, nextProps: SurfaceProps) {
    const keys = uniq(Object.keys(prevProps).concat(Object.keys(nextProps)));

    for (const key of keys) {
      const prev = (prevProps as any)[key];
      const next = (nextProps as any)[key];
      let tween = (this.tweens as any)[key];

      if (next instanceof TweenInstruction) {
        if (prev instanceof Tween) {
          tween = undefined;
        }

        // Mount
        if (!tween) {
          tween = new Tween(next.to, next.options);
          tween.instruct(next);
          (this.tweens as any)[key] = tween;
        } else if (!next.equals(tween.lastInstruction)) {
          tween.instruct(next);
        }
        continue;
      }

      if (next instanceof Tween) {
        (this.tweens as any)[key] = next;
        continue;
      }

      if (tween && prev instanceof TweenInstruction) {
        tween.stop();
      }
    }

    if (Object.keys(this.tweens).length > 0) {
      this.root.surfacesWithTweens.set(this.id, this);
    } else {
      this.root.surfacesWithTweens.delete(this.id);
    }
  }

  createTextStyleGetters (): GettableProps<PIXI.TextStyleOptions> {
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

  cascadeTextStyleGetters () {
    const parentGetters = this.parentNode ? this.parentNode.textStyleGetters : {};
    this.textStyleGetters = this.createTextStyleGetters();
    for (const key in this.textStyleGetters) {
      const getter = (this.textStyleGetters as any)[key];
      const parentGetter = (parentGetters as any)[key];
      const value = getter();
      const parentValue = parentGetter && parentGetter();
      if (value === undefined && parentValue !== undefined) {
        (this.textStyleGetters as any)[key] = parentGetter;
      }
    }
    for (const child of this.children) {
      child.cascadeTextStyleGetters();
    }
  }

  updateYoga () {
    const yogaNode = this.yogaNode as any;
    for (const key in this.props) {
      const transformer = getYogaValueTransformer(key);
      const setFn = yogaNode[transformer.functionName];
      if (setFn) {
        const value = ((this.tweenableProps as any)[key] as Tween<any>).value;
        const args = transformer.transform(value);
        setFn.apply(yogaNode, args);
      }
    }
  }

  updateMount () {
    mount(
      this.pixiContainer,
      this.props.backgroundColor !== undefined,
      () => this.backgroundColor,
      (value) => this.backgroundColor = value,
      () => new SurfaceBackground(),
      () => this.backgroundImage || this.border || this.childContainer
    );

    mount(
      this.pixiContainer,
      this.props.backgroundImage !== undefined,
      () => this.backgroundImage,
      (value) => this.backgroundImage = value,
      () => new SurfaceImage(),
      () => this.border || this.childContainer
    );

    mount(
      this.pixiContainer,
      SurfaceBorder.getWidths(this.tweenableProps).find((w) => w > 0),
      () => this.border,
      (value) => this.border = value,
      () => new SurfaceBorder(),
      () => this.childContainer
    );

    const needsMask = this.props.overflow === 'hidden' ||
      this.props.backgroundImage !== undefined ||
      (this.props.backgroundColor !== undefined && this.props.borderRadius !== undefined);

    mount(
      this.pixiContainer,
      needsMask,
      () => this.mask,
      (value) => this.mask = value,
      () => {
        const mask = new SurfaceBorder();
        mask.name = 'mask';
        return mask;
      },
      () => this.childContainer
    );

    if (this.pixiText) {
      if (this.pixiText.text !== this.textValue) {
        this.yogaNode.markDirty();
        this.pixiText.text = this.textValue!;
      }
    }
  }

  updatePixi () {
    const layout = this.yogaNode.getComputedLayout();
    if (!this.layout || layout.width !== this.layout.width || layout.height !== this.layout.height) {
      this.emitEvent('onSizeChanged', layout);
    }

    this.layout = layout;

    this.pixiContainer.rotation = this.tweenableProps.rotation.value || 0;
    this.pixiContainer.skew.set(
      definedOr(this.tweenableProps.skewX.value, 0),
      definedOr(this.tweenableProps.skewY.value, 0)
    );
    this.pixiContainer.scale.set(
      definedOr(this.tweenableProps.scaleX.value, 1),
      definedOr(this.tweenableProps.scaleY.value, 1)
    );
    this.pixiContainer.pivot.set(
      definedOr(this.tweenableProps.pivotX.value, layout.width / 2),
      definedOr(this.tweenableProps.pivotY.value, layout.height / 2)
    );
    this.pixiContainer.position.set(
      layout.left + definedOr(this.tweenableProps.translateX.value, 0) + this.pixiContainer.pivot.x,
      layout.top + definedOr(this.tweenableProps.translateY.value, 0) + this.pixiContainer.pivot.y
    );

    if (this.pixiText) {
      Object.assign(this.pixiText.style, this.cascadedTextStyle);
    }

    if (this.backgroundColor) {
      this.backgroundColor.color = this.tweenableProps.backgroundColor.value;
      this.backgroundColor.scale.set(layout.width, layout.height);
      this.backgroundColor.mask = this.mask!;
    }

    if (this.backgroundImage) {
      this.backgroundImage.update(layout, this.tweenableProps);
      this.backgroundImage.mask = this.mask!;

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

    this.pixiContainer.mask = (this.props.overflow === 'hidden' ? this.mask : undefined) as any;
    this.pixiContainer.alpha = definedOr(this.tweenableProps.opacity.value, 1);
  }

  appendChild (child: Surface) {
    if (!child) {
      return;
    }

    this.childContainer.addChild(child.pixiContainer);

    this.yogaNode.insertChild(child.yogaNode, this.mutableChildren.length);

    this.mutableChildren.push(child);
    child.parentNode = this;

    child.cascadeTextStyleGetters();
  }

  insertBefore (child: Surface, beforeChild: Surface) {
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

  removeChild (child: Surface) {
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

  protected addEventListener (name: string, handler: (e: interaction.InteractionEvent) => any) {
    this.pixiContainer.addListener(surfaceEvents[name].pixiName, handler);
  }

  protected removeEventListener (name: string, handler: (e: interaction.InteractionEvent) => any) {
    this.pixiContainer.removeListener(surfaceEvents[name].pixiName, handler);
  }

  emitEvent (name: string, ...args: any[]) {
    this.pixiContainer.emit(surfaceEvents[name].pixiName, ...args);
  }
}

export class SurfaceRoot extends Surface {
  private app: Application;
  private target: HTMLElement;
  private store: SurfaceStore;

  surfacesWithTweens: Map<number, Surface>;

  constructor (target: HTMLElement, store: SurfaceStore) {
    const app = new Application(target.clientWidth, target.clientHeight, {
      transparent: true,
      antialias: true
    });

    target.appendChild(app.view);

    super(undefined, 'root', app.stage);

    this.root = this;
    this.store = store;
    this.surfacesWithTweens = new Map<number, Surface>();
    this.target = target;
    this.app = app;

    this.app.ticker.add(this.updateTweens.bind(this));
    this.updateBounds();

    if (typeof window !== undefined) {
      window.addEventListener('resize', this.updateBounds.bind(this));
    }
  }

  destroy () {
    super.destroy();
    this.app.destroy(true);
  }

  afterCommit () {
    this.applyLayout();
  }

  private applyLayout () {
    this.yogaNode.calculateLayout(
      this.app.view.width,
      this.app.view.height,
      yoga.DIRECTION_LTR
    );

    const queue: Surface[] = [this];
    while (queue.length) {
      const next = queue.pop();
      next!.updatePixi();
      queue.push(...next!.children);
    }
  }

  private updateTweens () {
    const activeTweens = Tween.update();
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

  updateBounds () {
    this.app.renderer.resize(
      this.target.clientWidth,
      this.target.clientHeight
    );
    this.applyLayout();
  }
}

function mount <T extends DisplayObject> (
  container: Container,
  shouldBeMounted: boolean,
  getter: () => T | undefined,
  setter: (value?: T) => void,
  creator: () => T,
  before: () => DisplayObject
) {
  let obj = getter();
  if (shouldBeMounted) {
    if (!obj) {
      obj = creator();
      setter(obj);
      container.addChildAt(obj, container.getChildIndex(before()));
    }
  } else {
    if (obj) {
      container.removeChild(obj);
      setter(undefined);
    }
  }
}
