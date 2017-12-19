declare module JSX {
  interface IntrinsicElements {
    surface: SurfaceProps;
  }
}

// NOTE I put the types below here as declarations since I
// couldn't figure out how to use them as modules from global.d.ts
// TODO the types below should be modules in src/lib/

type SurfaceChild = string | React.ReactElement<SurfaceProps>;
declare type SurfaceProps = {
  // React internals
  key?: string | number;
  ref?: (surf: any) => void;
  children?: SurfaceChild | Array<SurfaceChild>
  hidden?: boolean;

  // Surface API
  style?: any;
  onClick?: (e: MouseEvent) => void;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
};

declare interface ISurface {
  children: ReadonlyArray<ISurface>;
  id: number;
  parentNode: ISurface;
  textValue: string;
  props: SurfaceProps;
  hostInstance: any;

  updateProps (props: SurfaceProps): void;

  appendChild (child: ISurface): void;

  insertBefore (child: ISurface, beforeChild: ISurface): void;

  removeChild (child: ISurface): void;
}

declare interface ISurfaceRoot extends ISurface {
  getNextSurfaceId (): number;
}

// TODO use react type when it becomes available
declare type FiberNode = {
  id: number
};
