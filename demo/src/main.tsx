import './assets/reset.css';
import * as React from 'react';
import {render as renderSurface} from 'react-surface';
import {load as loadFonts} from 'webfontloader';
import {fonts} from './assets/fonts';
import {AppContainer as HotLoaderContainer} from 'react-hot-loader';
import {App} from './App';

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

const memory = {};
function render (AppComponent: typeof App) {
  let composedApp = <AppComponent />;
  if (module.hot) {
    composedApp = (
      <AppContainer>
        {composedApp}
      </AppContainer>
    );
  }
  renderSurface(composedApp, domNode, memory);
}

function initApp () {
  render(App);
}
