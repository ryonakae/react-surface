import * as React from 'react';
import {SurfaceRenderer} from './SurfaceRenderer';

describe('Surface', () => {
  let renderer: SurfaceRenderer;
  let render: SurfaceRenderer['render'];

  beforeEach(() => {
    const domNode = document.createElement('div');
    domNode.style.width = '800px';
    domNode.style.height = '600px';

    renderer = new SurfaceRenderer(domNode);
    render = renderer.render.bind(renderer);
  });

  afterEach(() => {
    renderer.unmount();
  });

  // Surfaces

  it(`can create empty surface`, () => {
    const surface = render(<surface/>);
    expect(surface.children.length).toBe(0);
  });

  it(`can append surface`, () => {
    const container = render(
      <surface>
        <surface/>
      </surface>
    );

    const firstBefore = container.children[0];

    render(
      <surface>
        <surface/>
        <surface/>
      </surface>
    );

    const [firstAfter, secondAfter] = container.children;

    expect(firstBefore).toBe(firstAfter);
    expect(secondAfter).not.toBe(firstBefore);
  });

  it(`can insert surface`, () => {
    const surface = render(
      <surface>
        <surface key={1}/>
        <surface key={2}/>
        <surface key={3}/>
      </surface>
    );

    const beforeSurfaces = surface.children.slice();

    render(
      <surface>
        <surface key={1}/>
        <surface key="LOL"/>
        <surface key={2}/>
        <surface key={3}/>
      </surface>
    );

    const remainingSurfaces = surface.children.slice();
    const newSurface = remainingSurfaces.splice(1, 1)[0];

    // Expect the inserted surface to be new
    expect(beforeSurfaces).not.toContain(newSurface);

    // Expect the other surfaces to remain the same
    remainingSurfaces.forEach((after, index) => {
      const before = beforeSurfaces[index];
      expect(before).toBe(after);
    });
  });

  it(`can update surface`, () => {
    const afterProps = {width: 10, height: 10};

    const container = render(
      <surface>
        <surface/>
      </surface>
    );

    const beforeSurface = container.children[0];

    render(
      <surface>
        <surface {...afterProps}/>
      </surface>
    );

    const afterSurface = container.children[0];

    expect(beforeSurface).toBe(afterSurface);
    expect(afterSurface.props).toEqual(afterProps);
  });

  it(`can remove surface`, () => {
    const container = render(
      <surface>
        <surface key={1}/>
        <surface key={2}/>
      </surface>
    );

    const beforeTwo = container.children[1];

    render(
      <surface>
        <surface key={2}/>
      </surface>
    );

    const afterTwo = container.children[0];

    expect(container.children.length).toBe(1);
    expect(afterTwo).toBe(beforeTwo);
  });

  // Texts

  it(`can render text`, () => {
    const container = render(<surface>Hello</surface>);
    expect(container.children[0].textValue).toEqual('Hello');
  });

  it(`can update text`, () => {
    const container = render(<surface>Hello</surface>);
    render(<surface>Changed</surface>);
    expect(container.children[0].textValue).toEqual('Changed');
  });

  // Events
  
  it(`can add event handler`, () => {
    let triggered = false;
    const container = render(<surface onClick={() => triggered = true}/>);
    container.emitEvent('onClick');
    expect(triggered).toBe(true);
  });

  it(`can update event handler`, () => {
    let first = false;
    let second = false;
    const container = render(<surface onClick={() => first = true}/>);
    render(<surface onClick={() => second = true}/>);
    container.emitEvent('onClick');
    expect(first).toBe(false);
    expect(second).toBe(true);
  });
  
  it(`can remove event handler`, () => {
    let triggered = false;
    const container = render(<surface onClick={() => triggered = true}/>);
    render(<surface/>);
    container.emitEvent('onClick');
    expect(triggered).toBe(false);
  });
  
  // Sanity checking Yoga/Pixi integration

  it(`can customize size of root surface`, () => {
    const container = render(<surface {...{width: 150, height: 200}}/>);
    const layout = container.yogaNode.getComputedLayout();
    expect(layout.width).toBe(150);
    expect(layout.height).toBe(200);
  });

  it(`can flex in row`, () => {
    const container = render(
      <surface {...{width: 100, height: 100, flexDirection: 'row'}}>
        <surface {...{flexGrow: 1}}/>
        <surface {...{flexGrow: 1}}/>
      </surface>
    );

    const leftLayout = container.children[0].yogaNode.getComputedLayout();
    const rightLayout = container.children[1].yogaNode.getComputedLayout();

    expect([leftLayout.width, leftLayout.height]).toEqual([50, 100]);
    expect([rightLayout.width, rightLayout.height]).toEqual([50, 100]);
  });

  it(`can flex in column`, () => {
    const container = render(
      <surface {...{width: 100, height: 100, flexDirection: 'column'}}>
        <surface {...{flexGrow: 1}}/>
        <surface {...{flexGrow: 1}}/>
      </surface>
    );

    const leftLayout = container.children[0].yogaNode.getComputedLayout();
    const rightLayout = container.children[1].yogaNode.getComputedLayout();

    expect([leftLayout.width, leftLayout.height]).toEqual([100, 50]);
    expect([rightLayout.width, rightLayout.height]).toEqual([100, 50]);
  });

  it(`can use absolute position`, () => {
    const container = render(
      <surface {...{width: 100, height: 100}}>
        <surface {...{position: 'absolute', top: 10, right: 10, bottom: 10, left: 10}}/>
      </surface>
    );

    const layout = container.children[0].yogaNode.getComputedLayout();
    expect([layout.left, layout.top, layout.width, layout.height]).toEqual([10, 10, 80, 80]);
  });
});
