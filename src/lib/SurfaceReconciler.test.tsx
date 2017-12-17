import * as React from 'react';
import {createSurfaceReconciler, ReactContainer, ReactReconciler} from './SurfaceReconciler';
import {SurfaceComponentTree} from './SurfaceComponentTree';
import {NoopSurface, NoopSurfaceRoot} from './NoopSurface';

// Helpers
const App = ({items}: {items: any[]}) => (
  <surface>
    {items.map((props) => {
      let {key, value} = props;
      if (typeof props !== 'object') {
        value = key = props;
      }

      return (
        <surface key={key} value={value}/>
      );
    })}
  </surface>
);

describe('SurfaceReconciler', () => {
  let componentTree: SurfaceComponentTree;
  let reconciler: ReactReconciler<NoopSurfaceRoot>;
  let container: ReactContainer<NoopSurfaceRoot>;

  function render (element: React.ReactElement<{}>): ISurface {
    reconciler.updateContainer(element, container);
    return container.containerInfo.children[0];
  }

  beforeEach(() => {
    componentTree = new SurfaceComponentTree();
    reconciler = createSurfaceReconciler<NoopSurfaceRoot>(componentTree, (props) => new NoopSurface(props));
    container = reconciler.createContainer(new NoopSurfaceRoot());

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

  it(`can append child`, () => {
    const app = render(<App items={[1]}/>);
    expect(app.children.length).toBe(1);
  });

  it(`can append children in order`, () => {
    const values = [1, 2, 3];
    const app = render(<App items={values}/>);
    expect(app.children.length).toBe(values.length);
    app.children.forEach((child, index) =>
      expect(child.props.value).toBe(values[index])
    );
  });

  it(`can insert child`, () => {
    const app = render(<App items={[1, 2, 3]} />);
    const beforeSurfaces = app.children.slice();

    render(<App items={[1, 10, 2, 3]} />);
    const remainingSurfaces = app.children.slice();
    const newSurface = remainingSurfaces.splice(1, 1)[0];

    // Expect the inserted surface to be new
    expect(beforeSurfaces).not.toContain(newSurface);
    expect(newSurface.props.value).toBe(10);

    // Expect the other surfaces to remain the same
    remainingSurfaces.forEach((after, index) => {
      const before = beforeSurfaces[index];
      expect(before).toBe(after);
    });
  });

  it(`can update a surface value`, () => {
    const beforeItem = 1;
    const afterItem = {key: 1, value: 5};

    let app = render(<App items={[beforeItem]} />);
    const beforeSurface = app.children[0];

    app = render(<App items={[afterItem]}/>);
    const afterSurface = app.children[0];

    expect(beforeSurface).toBe(afterSurface);
    expect(afterSurface.props.value).toBe(afterItem.value);
  });

  it(`can remove child`, () => {
    render(<App items={[1, 2]}/>);
    const app = render(<App items={[2]}/>);
    expect(app.children.length).toBe(1);
    expect(app.children[0].props.value).toBe(2);
  });

  xit(`can update props`, () => {

  });

  // Texts

  xit(`can append text child`, () => {

  });

  xit(`can insert text child before`, () => {

  });

  xit(`can remove text child`, () => {

  });

  xit(`can update text value `, () => {

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
