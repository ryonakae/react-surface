import './assets/reset.css';
import * as React from 'react';
import {load as loadFonts} from 'webfontloader';
import {fonts} from './assets/fonts';
import {AppContainer as HotLoaderContainer} from 'react-hot-loader';
import {App} from './App';
import {SurfaceRenderer} from '../../src';
import {useStrict} from 'mobx';
import {ToastyStore} from './state/ToastyStore';

useStrict(true);
const store = new ToastyStore();

// Load global assets
loadFonts({
  google: {families: Object.values(fonts)},
  active: initApp,
  inactive: initApp
});

class AppContainer extends React.Component {
  componentWillMount () {
    module.hot.accept('./App', () => {
      const NextApp = require<{App: typeof App}>('./App').App;
      render(NextApp);
    });
  }

  render () {
    return (
      <HotLoaderContainer>
        {this.props.children as any}
      </HotLoaderContainer>
    );
  }
}

const domNode = document.createElement('div');
domNode.className = 'root';
document.body.appendChild(domNode);
const renderer = new SurfaceRenderer(domNode);

function render (AppComponent: typeof App) {
  let composedApp = <AppComponent surfaceStore={renderer.store} toastyStore={store} />;
  if (module.hot) {
    composedApp = (
      <AppContainer>
        {composedApp}
      </AppContainer>
    );
  }
  renderer.render(composedApp);
}

function initApp () {
  render(App);
}
