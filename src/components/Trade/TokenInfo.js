import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import marketStore from '../../stores/marketStore'

class TokenInfo extends Component {
  componentDidMount = async () => {
    const { token, marketStore } = this.props

    await marketStore.getTokensBySymbol(token)
  }

  render() {
    const { marketStore } = this.props
    return <Fragment>{marketStore.token ? JSON.stringify(marketStore.token.data.token) : 'null'} </Fragment>
  }
}

export default compose(
  inject('marketStore'),
  observer
)(TokenInfo)
