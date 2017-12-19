import {isDirectTextChildProps} from './isDirectTextChildProps';
import {diffEventProps} from './diffEventProps';

export class BaseSurface implements ISurface {
  id: number;
  parentNode: BaseSurface;
  textValue: string;
  hostInstance: any;

  public props: SurfaceProps = {};
  private mutableChildren: BaseSurface[] = [];

  get children () {
    return Object.freeze(this.mutableChildren.slice());
  }

  updateProps (nextProps: SurfaceProps): void {
    if (isDirectTextChildProps(nextProps)) {
      this.textValue = nextProps.children as string;
      return;
    }

    const prevProps = this.props;
    this.props = nextProps;

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
  }

  appendChild (child: BaseSurface): void {
    this.mutableChildren.push(child);
    child.parentNode = this;
  }

  insertBefore (child: BaseSurface, beforeChild: BaseSurface): void {
    const index = this.mutableChildren.indexOf(beforeChild);
    this.mutableChildren.splice(index, 0, child);
    child.parentNode = this;
  }

  removeChild (child: BaseSurface): void {
    const index = this.mutableChildren.indexOf(child);
    this.mutableChildren.splice(index, 1);
    child.parentNode = undefined;
  }

  protected addEventListener (name: string, handler: (e: Event) => any) {
    // noop
  }

  protected removeEventListener (name: string, handler: (e: Event) => any) {
    // noop
  }

  emitEvent (e: Event) {
    // noop
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
