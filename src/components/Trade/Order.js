import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

class Order extends Component {
  constructor(props) {
    super(props)
  }

  onTestClick = () => {
    const { tradeStore } = this.props
    tradeStore.test()
  }

  render() {
    return (
      <Fragment>
        Order
        <button onClick={this.onTestClick}>Test/</button>
      </Fragment>
    )
  }
}

export default compose(
  inject('marketStore'),
  observer
)(Order)
