import React, { Component, Fragment } from 'react'

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

export default TokenInfo
