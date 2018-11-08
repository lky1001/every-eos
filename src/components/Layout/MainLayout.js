import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Header, Footer } from '../../components/Layout'
import './Core.scss'
import './LayoutVariants.scss'

class MainLayout extends React.Component {
  render() {
    const { children } = this.props
    const animationName = 'rag-fadeIn'

    return (
      <div className="layout-container">
        <Header />
        <div className="sidebar-layout-obfuscator" />

        <ReactCSSTransitionGroup
          component="main"
          className="main-container"
          transitionName={animationName}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          {children}
          <Footer />
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default MainLayout
