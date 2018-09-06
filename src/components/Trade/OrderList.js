import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

class OrderList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <Fragment>Order List</Fragment>
  }
}

export default compose(
  inject('marketStore'),
  observer
)(OrderList)
