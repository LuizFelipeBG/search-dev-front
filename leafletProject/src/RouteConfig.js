import React, { Component } from 'react'
import createHashHistory from 'history/createBrowserHistory'
import { Router, Route, Switch } from 'react-router-dom'

import BulkRegister from './containers/bulkRegister/BulkRegister'
import Login from './containers/auth/Login'
import ForgotPassword from './containers/auth/ForgotPassword'

const history = createHashHistory()

export default class Routes extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/nova-senha" component={Login} />
          <Route path="/recuperar-senha" component={ForgotPassword} />
          <Route path="/pilhas" component={BulkRegister} />
        </Switch>
      </Router>
    )
  }
}
