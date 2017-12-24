import {Application, Container, Graphics, Text, TextMetrics, TextStyle, interaction, Sprite} from 'pixi.js';
import {diffEventProps} from './diffEventProps';
import {colors} from './constants';
import * as Color from 'color';
import {Size} from './Bounds';
import {takeYogaEdgeValues, yogaEventNameMap, yogaValueTransformers} from './YogaHelpers';
const yoga = require('yoga-layout');

export class Surface {
  private mutableChildren: Surface[] = [];
  private pixiContainer: Container;
  private effectsContainer: Container;
  private childContainer: Container;
  private pixiText: Text;
  public yogaNode: YogaNode;
  public parentNode: Surface;
  public id: number;
  public props: SurfaceProps = {};

  constructor (
    isText: boolean = false,
    container?: Container
  ) {
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
    this.updateYoga(nextProps.style);
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

  updateYoga (props: YogaProps = {}) {
    const clonedProps = {...props};
    const yogaNode = this.yogaNode as any;

    if (this.pixiText) {
      yogaNode.markDirty();
    }

    const paddingValues = takeYogaEdgeValues(clonedProps, 'padding');
    for (const edge in paddingValues) {
      yogaNode.setPadding(edge, paddingValues[edge]);
    }

    const marginValues = takeYogaEdgeValues(clonedProps, 'margin');
    for (const edge in marginValues) {
      yogaNode.setMargin(edge, marginValues[edge]);
    }

    for (const key in clonedProps) {
      const setPropertyName = 'set' + key[0].toUpperCase() + key.substr(1);
      const setFn = yogaNode[setPropertyName];
      if (setFn) {
        const value = (clonedProps as any)[key];
        const transformer = yogaValueTransformers[key];
        setFn.call(yogaNode, transformer ? transformer(value) : value);
      }
    }
  }

  updatePixi () {
    const layout = this.yogaNode.getComputedLayout();
    this.pixiContainer.position.set(layout.left, layout.top);

    if (this.effectsContainer) {
      // TODO don't clear, use lookup instead
      for (const child of this.effectsContainer.children) {
        this.effectsContainer.removeChild(child);
      }

      const style: SurfaceStyle = this.props.style || {};

      let mask: Graphics;
      const getMask = () => {
        if (mask) {
          return mask;
        }
        mask = createRectGraphics(layout, colors.transparent, style.borderRadius);
        this.pixiContainer.addChild(mask);
        return mask;
      };

      if (style.backgroundColor !== undefined) {
        this.effectsContainer.addChild(
          createRectGraphics(layout, style.backgroundColor, style.borderRadius)
        );
      }

      if (style.backgroundImage !== undefined) {
        const sprite = Sprite.fromImage(style.backgroundImage);
        sprite.mask = getMask();
        sprite.alpha = style.backgroundImageOpacity || 1;
        this.effectsContainer.addChild(sprite);
      }

      this.pixiContainer.mask = style.overflow === 'hidden' ? getMask() : undefined;
    }

    if (this.pixiText) {
      Object.assign(this.pixiText.style, this.cascadedTextStyle);
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

export class SurfaceRoot extends Surface {
  private app: Application;
  private bounds: {width: number, height: number};
  private target?: HTMLElement;

  constructor (target: HTMLElement) {
    const app = new Application(target.clientWidth, target.clientHeight, {
      transparent: true,
      antialias: true
    });

    target.appendChild(app.view);

    super(false, app.stage);

    this.target = target;
    this.app = app;
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

  applyLayout () {
    this.yogaNode.calculateLayout(this.bounds.width, this.bounds.height, yoga.DIRECTION_LTR);
    const queue: Surface[] = [this];
    while (queue.length) {
      const next = queue.pop();
      next.updatePixi();
      queue.push(...next.children);
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

function createRectGraphics (size: Size, color: Color, borderRadius: number) {
  const gfx = new Graphics();
  gfx.beginFill(color.rgbNumber(), color.alpha());
  if (borderRadius !== undefined) {
    gfx.drawRoundedRect(0, 0, size.width, size.height, borderRadius);
  } else {
    gfx.drawRect(0, 0, size.width, size.height);
  }
  gfx.endFill();
  return gfx;
}
