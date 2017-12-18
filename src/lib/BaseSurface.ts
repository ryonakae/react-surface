import {isDirectTextChildProps} from './isDirectTextChildProps';

export class BaseSurface implements ISurface {
  id: number;
  parentNode: ISurface;
  textValue: string;

  public props: SurfaceProps;
  private mutableChildren: ISurface[] = [];

  get children () {
    return Object.freeze(this.mutableChildren.slice());
  }

  constructor (
    props: SurfaceProps = {}
  ) {
    this.updateProps(props);
  }

  updateProps (props: SurfaceProps): void {
    this.props = props;
    if (isDirectTextChildProps(props)) {
      this.textValue = props.children;
    }
  }

  appendChild (child: ISurface): void {
    this.mutableChildren.push(child);
    child.parentNode = this;
  }

  insertBefore (child: ISurface, beforeChild: ISurface): void {
    const index = this.mutableChildren.indexOf(beforeChild);
    this.mutableChildren.splice(index, 0, child);
    child.parentNode = this;
  }

  removeChild (child: ISurface): void {
    const index = this.mutableChildren.indexOf(child);
    this.mutableChildren.splice(index, 1);
    child.parentNode = undefined;
  }
}

export class BaseSurfaceRoot extends BaseSurface implements ISurfaceRoot {
  private idCounter = 0;

  getNextSurfaceId () {
    const nextId = this.idCounter;
    this.idCounter += 1;
    return nextId;
  }
}
