import React, { Component } from 'react'
import componentQueries from 'react-component-queries'
import { BrowserRouter, Switch } from 'react-router-dom'
import { LayoutRoute, MainLayout } from './components/Layout'

import Bootstrap from './components/Bootstrap/Bootstrap'
import Cards from './components/Bootstrap/Cards.scss'
import Common from './components/Common/Common'
import Colors from './components/Colors/Colors'

import { HomePage, TradePage, MarketPage, OrderHistoryPage, WalletPage } from './pages'

const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`
}

class App extends Component {
  render() {
    return (
      <BrowserRouter basename={getBasename()}>
        <Switch>
          <LayoutRoute exact path="/" layout={MainLayout} component={HomePage} />
          <LayoutRoute exact path="/markets" layout={MainLayout} component={MarketPage} />
          <LayoutRoute exact path="/orders" layout={MainLayout} component={OrderHistoryPage} />
          <LayoutRoute exact path="/wallets" layout={MainLayout} component={WalletPage} />
          <LayoutRoute exact path="/trades/:token" layout={MainLayout} component={TradePage} />
        </Switch>
      </BrowserRouter>
    )
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' }
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' }
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' }
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' }
  }

  if (width > 1200) {
    return { breakpoint: 'xl' }
  }

  return { breakpoint: 'xs' }
}

export default componentQueries(query)(App)
