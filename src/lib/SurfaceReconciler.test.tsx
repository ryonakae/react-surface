import * as React from 'react';
import {createSurfaceReconciler, ReactContainer, ReactReconciler} from './SurfaceReconciler';
import {SurfaceComponentTree} from './SurfaceComponentTree';
import {BaseSurface, BaseSurfaceRoot} from './BaseSurface';

// Helpers
describe('SurfaceReconciler', () => {
  let componentTree: SurfaceComponentTree;
  let reconciler: ReactReconciler<BaseSurfaceRoot>;
  let container: ReactContainer<BaseSurfaceRoot>;

  function render (element: React.ReactElement<{}>): ISurface {
    reconciler.updateContainer(element, container);
    return container.containerInfo.children[0];
  }

  beforeEach(() => {
    componentTree = new SurfaceComponentTree();
    reconciler = createSurfaceReconciler<BaseSurfaceRoot>(componentTree, (props) => new BaseSurface(props));
    container = reconciler.createContainer(new BaseSurfaceRoot());

    this.originalConsoleInfo = console.info;
    console.info = (): null => null;
  });

  afterEach(() => {
    console.info = this.originalConsoleInfo;
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
    const afterProps = {style: {width: 10, height: 10}, hidden: false};

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

    const [beforeOne, beforeTwo] = container.children;

    render(
      <surface>
        <surface key={2}/>
      </surface>
    );

    const [afterTwo] = container.children;

    expect(container.children.length).toBe(1);
    expect(afterTwo).toBe(beforeTwo);
  });

  // Texts

  it(`can initialize text content`, () => {
    const container = render(<surface>Hello</surface>);
    expect(container.textValue).toEqual('Hello');
  });

  it(`can set text content`, () => {
    const container = render(<surface>Hello</surface>);
    render(<surface>Changed</surface>);
    expect(container.textValue).toEqual('Changed');
  });

  it(`can insert text`, () => {
    const container = render(
      <surface>
        <surface key="left"/>
        <surface key="right"/>
      </surface>
    );

    const [leftBefore, rightBefore] = container.children.slice();

    render(
      <surface>
        <surface key="left"/>
        Inserted
        <surface key="right"/>
      </surface>
    );

    expect(container.children.length).toBe(3);
    const [leftAfter, middleAfter, rightAfter] = container.children.slice();

    expect(leftAfter).toBe(leftBefore);
    expect(rightAfter).toBe(rightBefore);

    expect([leftBefore, rightBefore]).not.toContain(middleAfter);
    expect(middleAfter.textValue).toBe('Inserted');
  });

  it(`can update text`, () => {
    const container = render(
      <surface>
        <surface/>
        Original
        <surface/>
      </surface>
    );

    const [leftBefore, middleBefore, rightBefore] = container.children.slice();

    render(
      <surface>
        <surface/>
        Updated
        <surface/>
      </surface>
    );

    const [leftAfter, middleAfter, rightAfter] = container.children.slice();

    expect(leftAfter).toBe(leftBefore);
    expect(middleAfter).toBe(middleBefore);
    expect(rightAfter).toBe(rightBefore);
    expect(middleAfter.textValue).toBe('Updated');
  });

  it(`can remove text`, () => {
    const container = render(
      <surface>
        <surface key="left"/>
        Text
        <surface key="right"/>
      </surface>
    );

    const [leftBefore, middleBefore, rightBefore] = container.children.slice();

    render(
      <surface>
        <surface key="left"/>
        <surface key="right"/>
      </surface>
    );

    const [leftAfter, rightAfter] = container.children.slice();

    expect(container.children.length).toBe(2);
    expect(leftAfter).toBe(leftBefore);
    expect(rightAfter).toBe(rightBefore);
  });

  // Events
  
  xit(`can bind events`, () => {

  });
  
  xit(`can unbind events`, () => {

  });

  // Side effects

  xit(`ignores updates with no prop changes`, () => {

  });

  xit(`gets added to component tree`, () => {

  });

  xit(`gets removed from component tree`, () => {

  });
});
