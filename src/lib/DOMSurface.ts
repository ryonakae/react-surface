import {BaseSurface} from './BaseSurface';

export class DOMSurface extends BaseSurface {
  id: number;

  private textNode: Text;
  private domNode: HTMLElement;

  constructor (
    props: SurfaceProps,
    isText: boolean,
    root: DOMSurfaceRoot,
    node: HTMLElement | Text = undefined
  ) {
    super(props);

    if (root) {
      this.id = root.getNextSurfaceId();
    } else if (this instanceof DOMSurfaceRoot) {
      this.id = this.getNextSurfaceId();
    } else {
      throw new Error('Could not get surface root');
    }

    if (isText) {
      this.textNode = (node as Text) || document.createTextNode('');
    } else {
      this.domNode = (node as HTMLElement) || document.createElement('div');
    }

    console.info('new ' + this.constructor.name + '()', props);
    this.updateProps(props);
  }

  get node () {
    return this.textNode || this.domNode;
  }

  get textValue () {
    console.info(this.constructor.name + '.getTextValue', ...arguments);
    return this.textNode.textContent;
  }

  set textValue (text: string) {
    console.info(this.constructor.name + '.setTextValue', ...arguments);
    this.textNode.textContent = text;
  }

  updateProps (props: SurfaceProps) {
    super.updateProps(props);

    console.info(this.constructor.name + '.updateProps', ...arguments);
    const {style, children}: any = props;
    if (this.domNode) {
      for (const styleKey in style) {
        const newValue = style[styleKey];
        (this.domNode.style as any)[styleKey] = typeof newValue === 'number' ? newValue + 'px' : newValue;
      }
    }
    if (children) {
      // this.domNode.textContent = children;
    }
    // TODO bind/unbind event handlers
  }

  appendChild (child: DOMSurface) {
    super.appendChild(child);
    this.domNode.appendChild(child.node);
    console.info(this.constructor.name + '.appendChild', ...arguments);
  }

  insertBefore (child: DOMSurface, beforeChild: DOMSurface) {
    super.insertBefore(child, beforeChild);
    this.domNode.insertBefore(child.node, beforeChild.node);
    console.info(this.constructor.name + '.insertBefore', ...arguments);
  }

  removeChild (child: DOMSurface) {
    super.removeChild(child);
    this.domNode.removeChild(child.node);
    console.info(this.constructor.name + '.removeChild', ...arguments);
  }
}

export class DOMSurfaceRoot extends DOMSurface implements ISurfaceRoot {
  private idCounter = 0;

  constructor (target: HTMLElement) {
    super({}, false, null, target);
  }

  getNextSurfaceId () {
    const nextId = this.idCounter;
    this.idCounter += 1;
    return nextId;
  }
}
