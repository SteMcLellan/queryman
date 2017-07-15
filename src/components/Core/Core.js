import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import { components, history, store } from '../components.js';
import styles from './component.less';

const Core = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div className="window">
          <components.Toolbar />
          <div className="window-content">
            <div className="pane-group">
              <div className="pane-sm sidebar"><components.Menu /></div>
              <div className="pane padded"><AppRouter /></div>
            </div>
          </div>
          <components.Footer />
        </div>
      </ConnectedRouter>
    </Provider>
  );
}

const AppRouter = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/connection/:cxnid" component={components.Connections} />
      <Route path="/query/:queryid" component={components.Query} />
    </Switch>
  );
}

const Home = () => {
  return (
    <div>
      <h1>Queryman</h1>
      <p>Query documents from Cosmos DB!</p>
    </div>
  );
}

export default Core;
