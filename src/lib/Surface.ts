import {Application, Container, Graphics, Text, TextMetrics, TextStyle, interaction, Sprite} from 'pixi.js';
import {diffEventProps} from './diffEventProps';
import {commonColors} from './constants';
import {getYogaValueTransformer, takeYogaEdgeValues, yogaEventNameMap} from './YogaHelpers';
import {createBorderGraphics, createRectGraphics, resizeAndPositionSprite} from './RenderHelpers';
import * as Color from 'color';
import {Tween} from './tween/Tween';
import TweenInstruction from './tween/TweenInstruction';
const yoga = require('yoga-layout');

export class Surface {
  private isDestroyed: boolean;
  private mutableChildren: Surface[] = [];
  private pixiContainer: Container;
  private effectsContainer: Container;
  private childContainer: Container;
  private pixiText: Text;
  public yogaNode: YogaNode;
  public parentNode: Surface;
  public id: number;
  public props: SurfaceProps = {};

  tweens = new TweenReferences(this);

  constructor (
    public root: SurfaceRoot,
    isText: boolean = false,
    container?: Container
  ) {
    if (this instanceof SurfaceRoot) {
      this.root = this;
    }

    this.yogaNode = yoga.Node.create();
    this.pixiContainer = container || new Container();

    // TODO optimize: minimize number of containers
    if (isText) {
      this.yogaNode.setMeasureFunc(this.measureText.bind(this));
      this.pixiText = new PIXI.Text();
      this.pixiContainer.addChild(this.pixiText);
    } else {
      this.childContainer = new Container();
      this.effectsContainer = new Container();
      this.pixiContainer.addChild(this.effectsContainer);
      this.pixiContainer.addChild(this.childContainer);
    }
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
    this.tweens.flush(true);
  }

  get children () {
    return Object.freeze(this.mutableChildren.slice());
  }

  get hostInstance () {
    return this.pixiContainer;
  }

  get textValue () {
    return this.pixiText && this.pixiText.text;
  }

  set textValue (text: string) {
    if (this.pixiText) {
      this.pixiText.text = text;
      this.yogaNode.markDirty();
    }
  }

  get cascadedTextStyle (): PIXI.TextStyleOptions {
    // TODO optimize: generate cascade on property changes instead of on request
    const parentStyle: any = this.parentNode ? {...this.parentNode.cascadedTextStyle} : {};

    return {
      ...parentStyle,
      ...this.props.style && this.props.style.text
    };
  }

  measureText () {
    const measurement = TextMetrics.measureText(this.pixiText.text, new TextStyle(this.cascadedTextStyle));
    return {
      width: measurement.maxLineWidth,
      height: measurement.lines.length * measurement.lineHeight,
    };
  }

  updateProps (nextProps: SurfaceProps) {
    const prevProps = this.props;
    this.props = nextProps;
    this.textValue = nextProps.value;
    this.updateEvents(prevProps, nextProps);

    this.tweens.track();
    this.updateYoga(nextProps.style);
    this.updatePixi();
    this.tweens.flush();
  }

  updateEvents (prevProps: SurfaceProps, nextProps: SurfaceProps): void {
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

    this.pixiContainer.interactive = this.pixiContainer.eventNames().length > 0;
  }

  updateYoga (props: YogaProps = this.props.style) {
    const clonedProps = {...props};
    const yogaNode = this.yogaNode as any;

    if (this.pixiText) {
      yogaNode.markDirty();
    }

    const borderValues = takeYogaEdgeValues(this.tweens.reference.bind(this.tweens), 'border', true) as number[];
    for (const edge in borderValues) {
      yogaNode.setBorder(edge, borderValues[edge]);
    }

    const paddingValues = takeYogaEdgeValues(this.tweens.reference.bind(this.tweens), 'padding', true) as number[];
    for (const edge in paddingValues) {
      yogaNode.setPadding(edge, paddingValues[edge]);
    }

    const marginValues = takeYogaEdgeValues(this.tweens.reference.bind(this.tweens), 'margin', true) as number[];
    for (const edge in marginValues) {
      yogaNode.setMargin(edge, marginValues[edge]);
    }

    for (const key in clonedProps) {
      // HACK don't do this it's absolutely stupid
      if (/border|padding|margin/.test(key)) {
        continue;
      }

      const transformer = getYogaValueTransformer(key);
      const setFn = yogaNode[transformer.functionName];
      if (setFn) {
        const value = this.tweens.reference(key);
        const args = transformer.transform(value);
        setFn.apply(yogaNode, args);
      }
    }
  }

  updatePixi () {
    const layout = this.yogaNode.getComputedLayout();

    this.pixiContainer.rotation = this.tweens.reference('transform.rotation', 0);
    this.pixiContainer.skew.set(
      this.tweens.reference('transform.skewX', 0),
      this.tweens.reference('transform.skewY', 0)
    );
    this.pixiContainer.scale.set(
      this.tweens.reference('transform.scaleX', 1),
      this.tweens.reference('transform.scaleY', 1)
    );
    this.pixiContainer.pivot.set(
      this.tweens.reference('transform.pivotX', layout.width / 2),
      this.tweens.reference('transform.pivotY', layout.height / 2)
    );
    this.pixiContainer.position.set(
      layout.left + this.tweens.reference('transform.x', 0) + this.pixiContainer.pivot.x,
      layout.top + this.tweens.reference('transform.y', 0) + this.pixiContainer.pivot.y
    );

    if (this.pixiText) {
      Object.assign(this.pixiText.style, this.cascadedTextStyle);
    }

    if (this.effectsContainer) {
      // TODO don't clear, use lookup instead
      for (const child of this.effectsContainer.children) {
        this.effectsContainer.removeChild(child);
      }

      const style = {...this.props.style};
      const borderRadius = this.tweens.reference('borderRadius', 0);
      const backgroundColor: Color = this.tweens.reference('backgroundColor');

      let mask: Graphics;
      const getMask = () => {
        if (mask) {
          return mask;
        }
        mask = createRectGraphics(layout, commonColors.transparent, borderRadius);
        this.effectsContainer.addChild(mask);
        return mask;
      };

      if (backgroundColor !== undefined) {
        this.effectsContainer.addChild(
          createRectGraphics(layout, backgroundColor, borderRadius)
        );
      }

      if (style.backgroundImage !== undefined) {
        const sprite = Sprite.fromImage(style.backgroundImage);
        // TODO use central loader instead
        if (sprite.texture.baseTexture.isLoading) {
          sprite.texture.baseTexture.on('loaded', () => {
            if (!this.isDestroyed) {
              this.updatePixi();
            }
          });
        }

        sprite.mask = getMask();
        sprite.alpha = this.tweens.reference('backgroundOpacity', 1);
        resizeAndPositionSprite(
          sprite,
          layout,
          this.tweens.reference('backgroundPosition'),
          this.tweens.reference('backgroundSize')
        );
        this.effectsContainer.addChild(sprite);
      }

      const borderValues = takeYogaEdgeValues(this.tweens.reference.bind(this.tweens), 'border', true) as number[];
      const hasBorder = borderValues.find((width) => width > 0);
      if (hasBorder) {
        const borderColorValues = takeYogaEdgeValues(
          this.tweens.reference.bind(this.tweens),
          'borderColor',
          true,
          commonColors.transparent
        ) as Color[];
        this.effectsContainer.addChild(
          createBorderGraphics(
            layout,
            borderValues,
            borderRadius,
            borderColorValues
          )
        );
      }

      this.pixiContainer.mask = style.overflow === 'hidden' ? getMask() : undefined;
    }
  }

  appendChild (child: Surface) {
    if (!child) {
      return;
    }

    this.childContainer.addChild(child.pixiContainer);

    this.yogaNode.insertChild(child.yogaNode, this.mutableChildren.length);

    this.mutableChildren.push(child);
    child.parentNode = this;
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
    this.pixiContainer.addListener(yogaEventNameMap[name], handler);
  }

  protected removeEventListener (name: string, handler: (e: interaction.InteractionEvent) => any) {
    this.pixiContainer.removeListener(yogaEventNameMap[name], handler);
  }

  emitEvent (name: string, ...args: any[]) {
    this.pixiContainer.emit(yogaEventNameMap[name], ...args);
  }
}

class TweenReferences {
  private tweens = new Map<string, Tween<any>>();
  private expired = new Map<string, boolean>();

  constructor (
    private surface: Surface
  ) {}

  reference (path: string, fallbackValue?: any) {
    const steps = path.split('.');

    let obj: any = this.surface.props.style;
    for (const step of steps) {
      if (!obj || !obj.hasOwnProperty(step)) {
        return fallbackValue;
      }
      obj = obj[step];
    }

    if (obj instanceof TweenInstruction) {
      let tween = this.tweens.get(path);
      if (!tween) {
        tween = new Tween(obj.to, obj.options);
        tween.instruct(obj);
        this.tweens.set(path, tween);
      } else if (!obj.equals(tween.lastInstruction)) {
        tween.instruct(obj);
      }
      this.expired.delete(path);
      return tween.value;
    } if (obj instanceof Tween) {
      return obj.value;
    }

    return obj;
  }

  track () {
    this.tweens.forEach((tween, key) => this.expired.set(key, true));
  }

  flush (expireAll: boolean = false) {
    if (expireAll) {
      this.track();
    }

    this.expired.forEach((throwAway, key) => {
      const tween = this.tweens.get(key);
      tween.stop();
      this.tweens.delete(key);
    });

    this.expired.clear();

    if (this.tweens.size > 0) {
      this.surface.root.surfacesWithTweens.set(this.surface.id, this.surface);
    } else {
      this.surface.root.surfacesWithTweens.delete(this.surface.id);
    }
  }
}

export class SurfaceRoot extends Surface {
  private app: Application;
  private bounds: {width: number, height: number};
  private target?: HTMLElement;

  surfacesWithTweens: Map<number, Surface>;

  constructor (target: HTMLElement) {
    const app = new Application(target.clientWidth, target.clientHeight, {
      transparent: true,
      antialias: true
    });

    target.appendChild(app.view);

    super(null, false, app.stage);

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
    this.yogaNode.calculateLayout(this.bounds.width, this.bounds.height, yoga.DIRECTION_LTR);
    const queue: Surface[] = [this];
    while (queue.length) {
      const next = queue.pop();
      next.updatePixi();
      queue.push(...next.children);
    }
  }

  private updateTweens () {
    Tween.update();

    if (this.surfacesWithTweens.size) {
      this.applyLayout();
    }

    for (const surface of this.surfacesWithTweens.values()) {
      surface.tweens.track();
      surface.updateYoga();
      surface.updatePixi();
      surface.tweens.flush();
    }
  }

  updateBounds () {
    this.bounds = {
      width: this.target.clientWidth,
      height: this.target.clientHeight
    };
    this.app.view.width = this.bounds.width;
    this.app.view.height = this.bounds.height;
    this.applyLayout();
  }
}
