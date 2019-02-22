declare module JSX {
  interface IntrinsicElements {
    text: SurfaceProps;
    surface: SurfaceProps;
  }
}

export type CSSProps = React.CSSProperties;
export type Percentage = string; // TODO can typescript enforce percentage strings?
export type SurfaceTweenInstruction = any;
export type SurfaceValue = number | SurfaceTweenInstruction;
export type SurfaceValueP = SurfaceValue | Percentage; // SurfaceValue with percentage support
export type SurfaceChild = React.ReactElement<SurfaceProps> | React.ReactNode;
export type SurfaceStyle = YogaProps & RenderProps;
export type SurfaceStyleDict = {[key: string]: SurfaceStyle};

// TODO use 'color' package
export type IColor = SurfaceTweenInstruction | {
  rgbNumber (): number;
  red (): number;
  green (): number;
  blue (): number;
  alpha (): number;
};

export type Point = {
  x: number,
  y: number
};

export type Size = {
  width: number,
  height: number
};

export type YogaProps = {
  position?: 'absolute' | 'relative',
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
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
  opacity?: SurfaceValue;
};

export type RenderProps = SurfaceTransform & {
  color?: IColor;
  textAlign?: 'start' | 'center' | 'end',
  wordWrap?: boolean;
  letterSpacing?: SurfaceValue;
  fontFamily?: string | string[];
  fontSize?: SurfaceValue;
  fontStyle?: string;
  fontWeight?: string;

  backgroundGradient?: any; // TODO type
  backgroundColor?: IColor;
  backgroundImage?: any;
  backgroundOpacity?: SurfaceValue,
  backgroundPosition?: Array<SurfaceValueP>;
  backgroundSize?: 'auto' | 'cover' | 'contain' | Percentage | Array<Percentage>;

  borderRadius?: SurfaceValue;
  borderColor?: IColor;
  borderColorTop?: IColor;
  borderColorRight?: IColor;
  borderColorBottom?: IColor;
  borderColorLeft?: IColor;
};

export type SurfaceTransform = {
  translateX?: SurfaceValue,
  translateY?: SurfaceValue,
  scaleX?: SurfaceValue,
  scaleY?: SurfaceValue,
  rotation?: SurfaceValue,
  skewX?: SurfaceValue,
  skewY?: SurfaceValue,
  pivotX?: SurfaceValue,
  pivotY?: SurfaceValue
};

export type SurfaceEvents = {
  onClick?: (e: PIXI.interaction.InteractionEvent) => void;
  onRightClick?: (e: PIXI.interaction.InteractionEvent) => void;
  onMouseUp?: (e: PIXI.interaction.InteractionEvent) => void;
  onMouseDown?: (e: PIXI.interaction.InteractionEvent) => void;
  onMouseEnter?: (e: PIXI.interaction.InteractionEvent) => void;
  onMouseLeave?: (e: PIXI.interaction.InteractionEvent) => void;
  onSizeChanged?: (size: Size) => void;
};

export type SurfaceProps = SurfaceEvents & RenderProps & YogaProps & {
  // React internals
  key?: string | number;
  ref?: (surf: any) => void;
  hidden?: boolean;
  children?: SurfaceChild | Array<SurfaceChild | Array<SurfaceChild>>;
};

// TODO replace types below with actual types from react-reconciler and yoga-layout when they are available

export type FiberNode = {
  _debugID: number;
  stateNode: Element; // TODO generate dom node equivalents of all surfaces to enable dev tool highlights
  type: string;
};

export type HostContext = {};

export type ReactContainer<TContainerInfo> = {
  containerInfo: TContainerInfo
};

export type ReactReconciler<TRoot> = {
  injectIntoDevTools (config: any): void;
  createContainer (root: TRoot): ReactContainer<TRoot>;
  updateContainer<P> (element: React.ReactElement<P>, container: ReactContainer<TRoot>): void;
};

export type YogaLayout = {
  left: number,
  top: number,
  right: number,
  bottom: number,
  width: number,
  height: number
};

export type YogaNode = {
  reset (): void;
  getParent (): YogaNode;
  getChild (index: number): YogaNode;
  getChildCount (): number;
  insertChild (child: YogaNode, index?: number): void;
  removeChild (child: YogaNode): void;
  calculateLayout (width: number, height: number, direction: any): void;
  getComputedLayout (): YogaLayout;
  setMeasureFunc (fn: () => any): void;
  markDirty (): void;
};
