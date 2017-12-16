import './assets/reset.css';
import * as React from 'react';
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

const rootEl = document.createElement('div');
rootEl.id = 'root';
document.body.appendChild(rootEl);

function render (AppComponent: typeof App) {
  let composedApp = <AppComponent/>;
  if (module.hot) {
    composedApp = (
      <AppContainer>
        {composedApp}
      </AppContainer>
    );
  }

  renderDOM(composedApp, rootEl);
}

function initApp () {
  render(App);
}
