import React, { Component } from 'react'
import componentQueries from 'react-component-queries'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Footer, Header } from './components/Layout'

import './components/Layout/Core.scss'
import './components/Layout/LayoutVariants.scss'

import Bootstrap from './components/Bootstrap/Bootstrap'
import Cards from './components/Bootstrap/Cards.scss'
import Common from './components/Common/Common'
import Colors from './components/Colors/Colors'

import { HomePage, TradePage, MarketPage, OrderHistoryPage, WalletPage } from './pages'

class App extends Component {
  render() {
    const animationName = 'rag-fadeIn'

    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="layout-container">
          <Header />
          <div className="sidebar-layout-obfuscator" />

          <ReactCSSTransitionGroup
            component="main"
            className="main-container"
            transitionName={animationName}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
          >
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/markets" component={MarketPage} />
              <Route exact path="/orders" component={OrderHistoryPage} />
              <Route exact path="/wallets" component={WalletPage} />
              <Route exact path="/trades/:token" component={TradePage} />
            </Switch>
            <Footer />
          </ReactCSSTransitionGroup>
        </div>
      </Router>
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
