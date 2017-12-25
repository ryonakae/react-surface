declare module JSX {
  interface IntrinsicElements {
    text: SurfaceProps & {
      style?: null
    };
    surface: SurfaceProps & {
      children?: SurfaceChild | Array<SurfaceChild | Array<SurfaceChild>>
    };
  }
}

type CSSProps = React.CSSProperties;
type Percentage = string; // TODO can typescript enforce percentage strings?
type SurfaceColor = any; // TODO use 'color' package
type SurfaceValue = number;
type SurfaceValueP = SurfaceValue | Percentage; // SurfaceValue with percentage support
type SurfaceChild = React.ReactElement<SurfaceProps>;
type SurfaceStyle = YogaProps & RenderProps;
type SurfaceStyleDict = {[key: string]: SurfaceStyle};

type Point = {
  x: number,
  y: number
};

type Size = {
  width: number,
  height: number
};

type YogaProps = {
  position?: 'absolute' | 'relative',
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  flex?: SurfaceValue;
  flexAlign?: any;
  flexBasis?: SurfaceValue;
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  flexFlow?: string;
  flexGrow?: SurfaceValue;
  flexItemAlign?: any;
  flexLinePack?: any;
  flexOrder?: any;
  flexShrink?: SurfaceValue;
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  top?: SurfaceValueP;
  right?: SurfaceValueP;
  bottom?: SurfaceValueP;
  left?: SurfaceValueP;
  width?: SurfaceValueP;
  height?: SurfaceValueP;
  minWidth?: SurfaceValueP;
  minHeight?: SurfaceValueP;
  maxWidth?: SurfaceValueP;
  maxHeight?: SurfaceValueP;
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  margin?: SurfaceValueP;
  marginBottom?: SurfaceValueP;
  marginLeft?: SurfaceValueP;
  marginRight?: SurfaceValueP;
  marginTop?: SurfaceValueP;
  padding?: SurfaceValueP;
  paddingBottom?: SurfaceValueP;
  paddingLeft?: SurfaceValueP;
  paddingRight?: SurfaceValueP;
  paddingTop?: SurfaceValueP;
  border?: SurfaceValueP;
  borderTop?: SurfaceValueP;
  borderRight?: SurfaceValueP;
  borderBottom?: SurfaceValueP;
  borderLeft?: SurfaceValueP;
  overflow?: 'visible' | 'hidden' | 'scroll';
};

type RenderProps = {
  text?: PIXI.TextStyleOptions,

  backgroundGradient?: any; // TODO type
  backgroundColor?: SurfaceColor;
  backgroundImage?: any;
  backgroundOpacity?: SurfaceValue,
  backgroundPosition?: Array<SurfaceValueP>;
  backgroundSize?: 'auto' | 'cover' | 'contain' | Percentage | Array<Percentage>;

  borderRadius?: number;
  borderColor?: SurfaceColor;
  borderColorTop?: SurfaceColor;
  borderColorRight?: SurfaceColor;
  borderColorBottom?: SurfaceColor;
  borderColorLeft?: SurfaceColor;

  transform?: SurfaceTransform
};

type SurfaceTransform = {
  x?: number,
  y?: number,
  scaleX?: number,
  scaleY?: number,
  rotation?: number,
  skewX?: number,
  skewY?: number,
  pivotX?: number,
  pivotY?: number
};

type SurfaceProps = {
  // React internals
  key?: string | number;
  ref?: (surf: any) => void;
  hidden?: boolean;

  // Surface API
  value?: string,
  style?: SurfaceStyle,
  onClick?: (e: PIXI.interaction.InteractionEvent) => void;
  onRightClick?: (e: PIXI.interaction.InteractionEvent) => void;
  onMouseUp?: (e: PIXI.interaction.InteractionEvent) => void;
  onMouseDown?: (e: PIXI.interaction.InteractionEvent) => void;
  onMouseEnter?: (e: PIXI.interaction.InteractionEvent) => void;
  onMouseLeave?: (e: PIXI.interaction.InteractionEvent) => void;
};

// TODO replace types below with actual types from react-reconciler and yoga-layout when they are available

type FiberNode = {
  id: number;
  stateNode: Element // TODO generate dom node equivalents of all surfaces to enable dev tool highlights
};

type HostContext = {};

type ReactContainer<TContainerInfo> = {
  containerInfo: TContainerInfo
};

type ReactReconciler<TRoot> = {
  injectIntoDevTools (config: any): void;
  createContainer (root: TRoot): ReactContainer<TRoot>;
  updateContainer<P> (element: React.ReactElement<P>, container: ReactContainer<TRoot>): void;
};

type YogaNode = {
  reset (): void;
  getParent (): YogaNode;
  getChild (index: number): YogaNode;
  getChildCount (): number;
  insertChild (child: YogaNode, index?: number): void;
  removeChild (child: YogaNode): void;
  calculateLayout (width: number, height: number, direction: any): void;
  getComputedLayout (): {left: number, top: number, right: number, bottom: number, width: number, height: number};
  setMeasureFunc (fn: () => any): void;
  markDirty (): void;
};
