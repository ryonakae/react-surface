import './assets/reset.css';
import * as React from 'react';
import {render as renderSurface} from 'react-surface';
import {render as renderDOM} from 'react-dom';
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

const domRoot = document.createElement('div');
const surfaceRoot = document.createElement('div');
domRoot.className = 'root';
surfaceRoot.className = 'root';
document.body.appendChild(domRoot);
document.body.appendChild(surfaceRoot);

function render (AppComponent: typeof App) {
  const targets: any = [
    [renderDOM, domRoot, false],
    [renderSurface, surfaceRoot, true]
  ];

  for (const [renderToTarget, target, log] of targets) {
    let composedApp = <AppComponent log={log}/>;
    if (module.hot) {
      composedApp = (
        <AppContainer>
          {composedApp}
        </AppContainer>
      );
    }
    renderToTarget(composedApp, target);
  }
}

function initApp () {
  render(App);
}
