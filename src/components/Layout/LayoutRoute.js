import React from 'react'
import { Route } from 'react-router-dom'

const LayoutRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <Route
    basename={process.env.PUBLIC_URL}
    {...rest}
    render={props => (
      <Layout>
        <Component {...props} />
      </Layout>
    )}
  />
)

export default LayoutRoute
