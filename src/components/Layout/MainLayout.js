import React from 'react'
import { Content, Footer, Header, Sidebar } from '../../components/Layout'

class MainLayout extends React.Component {
  render() {
    const { children } = this.props
    return (
      <main className="cr-app bg-light">
        <Sidebar />
        <Content fluid onClick={this.handleContentClick}>
          <Header />
          {children}
          <Footer />
        </Content>
      </main>
    )
  }
}

export default MainLayout
