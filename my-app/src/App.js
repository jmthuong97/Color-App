import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';

// Import css semantic
import 'semantic-ui-css/semantic.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css';
// Import Main styles for this application
import './scss/style.css'
// Containers
import { DefaultLayout } from './containers';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/" name="Home" component={DefaultLayout} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
