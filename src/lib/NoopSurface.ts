export class NoopSurface implements ISurface {
  id: number;
  parentNode: ISurface;
  textValue: string;

  private mutableChildren: ISurface[] = [];

  get children () {
    return Object.freeze(this.mutableChildren.slice());
  }

  constructor (
    public props: SurfaceProps = {}
  ) {}

  updateProps (props: SurfaceProps): void {
    this.props = props;
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

export class NoopSurfaceRoot extends NoopSurface implements ISurfaceRoot {
  private idCounter = 0;

  getNextSurfaceId () {
    const nextId = this.idCounter;
    this.idCounter += 1;
    return nextId;
  }
}
