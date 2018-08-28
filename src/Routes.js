import React from 'react'
import componentQueries from 'react-component-queries'
import { BrowserRouter, Redirect, Switch } from 'react-router-dom'
import { EmptyLayout, LayoutRoute, MainLayout } from './components/Layout'

import Home from './pages'

const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`
}

class Routes extends React.Component {
  render() {
    return (
      <BrowserRouter basename={getBasename()}>
        <Switch>
          <LayoutRoute exact path="/" layout={MainLayout} component={Home} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default Routes
