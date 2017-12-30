import './assets/reset.css';
import * as React from 'react';
import {load as loadFonts} from 'webfontloader';
import {fonts} from './assets/fonts';
import {AppContainer as HotLoaderContainer} from 'react-hot-loader';
import {App} from './App';
import {SurfaceRenderer} from '../../src';
import {useStrict} from 'mobx';
import {AppState} from './state/AppState';

// Initialize app state
useStrict(true);
const state = new AppState();
const domNode = document.createElement('div');
domNode.className = 'root';
document.body.appendChild(domNode);
const renderer = new SurfaceRenderer(domNode);
state.surface = renderer.store;

// Load global assets
loadFonts({
  google: {families: Object.values(fonts)},
  active: initApp,
  inactive: initApp
});

class AppContainer extends React.Component {
  componentWillMount () {
    module.hot!.accept('./App', () => {
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

function render (AppComponent: typeof App) {
  let composedApp = <AppComponent state={state} />;
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
