import {Application, Container, Graphics, Text, TextMetrics, TextStyle, interaction} from 'pixi.js';
import {diffEventProps} from './diffEventProps';
const yoga = require('yoga-layout');
const {Node} = yoga;

const yogaValueTransformers: {[key: string]: (value: string) => any} = {
  display (value: string) {
    switch (value) {
      case 'flex': return yoga.DISPLAY_FLEX;
      case 'none': return yoga.DISPLAY_NONE;
    }
  },

  position (value: string) {
    switch (value) {
      case 'relative': return yoga.POSITION_TYPE_RELATIVE;
      case 'absolute': return yoga.POSITION_TYPE_ABSOLUTE;
    }
  },

  overflow (value: string) {
    switch (value) {
      case 'visible': return yoga.OVERFLOW_VISIBLE;
      case 'hidden': return yoga.OVERFLOW_HIDDEN;
      case 'scroll': return yoga.OVERFLOW_SCROLL;
    }
  },

  alignItems (value: string) {
    switch (value) {
      case 'auto': return yoga.ALIGN_AUTO;
      case 'flex-start': return yoga.ALIGN_FLEX_START;
      case 'center': return yoga.ALIGN_CENTER;
      case 'flex-end': return yoga.ALIGN_FLEX_END;
      case 'stretch': return yoga.ALIGN_STRETCH;
      case 'baseline': return yoga.ALIGN_BASELINE;
      case 'space-between': return yoga.ALIGN_SPACE_BETWEEN;
      case 'space-around': return yoga.ALIGN_SPACE_AROUND;
    }
  },

  justifyContent (value: string) {
    switch (value) {
      case 'flex-start': return yoga.JUSTIFY_FLEX_START;
      case 'center': return yoga.JUSTIFY_CENTER;
      case 'flex-end': return yoga.JUSTIFY_FLEX_END;
      case 'space-between': return yoga.JUSTIFY_SPACE_BETWEEN;
      case 'space-around': return yoga.JUSTIFY_SPACE_AROUND;
      case 'space-evenly': return yoga.JUSTIFY_SPACE_EVENLY;
    }
  },

  flexDirection (value: string) {
    switch (value) {
      case 'column': return yoga.FLEX_DIRECTION_COLUMN;
      case 'row': return yoga.FLEX_DIRECTION_ROW;
    }
  },

  flexWrap (value: string) {
    switch (value) {
      case 'wrap': return yoga.WRAP_WRAP;
      case 'nowrap': return yoga.WRAP_NO_WRAP;
      case 'wrap-reverse': return yoga.WRAP_REVERSE;
    }
  }
};

const eventNameMap: {[key: string]: interaction.InteractionEventTypes} = {
  onClick: 'click',
  onRightClick: 'rightclick',
  onMouseDown: 'mousedown',
  onMouseUp: 'mouseup',
  onMouseEnter: 'mouseover',
  onMouseLeave: 'mouseout'
};

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
    this.yogaNode = Node.create();
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

    // TODO don't clear, use lookup instead
    if (this.effectsContainer) {
      for (const child of this.effectsContainer.children) {
        this.effectsContainer.removeChild(child);
      }

      const {backgroundColor, borderRadius}: SurfaceStyle = this.props.style || {};

      if (backgroundColor !== undefined) {
        const graphics = new Graphics();
        graphics.beginFill(backgroundColor.rgbNumber(), backgroundColor.alpha());
        if (borderRadius !== undefined) {
          graphics.drawRoundedRect(0, 0, layout.width, layout.height, borderRadius);
        } else {
          graphics.drawRect(0, 0, layout.width, layout.height);
        }
        graphics.endFill();
        this.effectsContainer.addChild(graphics);
      }
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
    this.pixiContainer.addListener(eventNameMap[name], handler);
  }

  protected removeEventListener (name: string, handler: (e: interaction.InteractionEvent) => any) {
    this.pixiContainer.removeListener(eventNameMap[name], handler);
  }

  emitEvent (name: string, ...args: any[]) {
    this.pixiContainer.emit(eventNameMap[name], ...args);
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

const edgeNames = ['Top', 'Right', 'Bottom', 'Left'];
const edgeValues = [yoga.EDGE_TOP, yoga.EDGE_RIGHT, yoga.EDGE_BOTTOM, yoga.EDGE_LEFT];
function takeYogaEdgeValues (props: any, propertyNameBase: string): number[] {
  const baseValues: number[] | number = props[propertyNameBase];

  let initialValues;
  if (baseValues === undefined) {
    initialValues = [0, 0, 0, 0];
  } else if (typeof baseValues === 'number') {
    initialValues = [baseValues, baseValues, baseValues, baseValues];
  } else {
    initialValues = baseValues;
  }

  return edgeNames.reduce(
    (values, cornerName, index) => {
      const propertyName = propertyNameBase + cornerName;
      if (props.hasOwnProperty(propertyName)) {
        const value = props[propertyName];
        delete props[propertyName];
        values[edgeValues[index]] = value;
      }
      return values;
    },
    initialValues
  );
}
