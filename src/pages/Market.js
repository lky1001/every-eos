import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

class Market extends Component {
  componentDidMount() {
    const { marketStore } = this.props

    marketStore.getTokenList()
  }

  render() {
    const { marketStore } = this.props

    return <Fragment>{marketStore.tokens ? JSON.stringify(marketStore.tokens) : 'null'}</Fragment>
  }
}

export default compose(
  inject('marketStore'),
  observer
)(Market)
