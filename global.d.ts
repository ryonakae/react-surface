declare module JSX {
  interface IntrinsicElements {
    surface: SurfaceProps;
  }
}

// NOTE I put the types below here as declarations since I
// couldn't figure out how to use them as modules from global.d.ts
// TODO the types below should be modules in src/lib/

declare type SurfaceProps = {
  key?: any,
  ref?: (surf: any) => void,
  style?: any,
  children?: any, // ISurface | Array<ISurface>
  hidden?: boolean,
  value?: any
};

declare interface ISurface {
  children: ReadonlyArray<ISurface>;
  id: number;
  parentNode: ISurface;
  textValue: string;
  props: SurfaceProps;

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
