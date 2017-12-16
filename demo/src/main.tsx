import './assets/reset.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as WebFontLoader from 'webfontloader';
import {fonts} from './assets/fonts';
import {AppContainer as HotLoaderContainer} from 'react-hot-loader';
import {App} from './App';

// Load global assets
WebFontLoader.load({
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

  ReactDOM.render(composedApp, rootEl);
}

function initApp () {
  render(App);
}
