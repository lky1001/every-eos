import React, { Component, Fragment } from 'react'

class TokenInfo extends Component {
  componentDidMount = async () => {
    const { symbol, marketStore } = this.props

    await marketStore.getTokenBySymbol(symbol)
  }

  render() {
    const { marketStore } = this.props
    return (
      <Fragment>
        {marketStore.token ? JSON.stringify(marketStore.token.data.token) : 'null'}{' '}
      </Fragment>
    )
  }
}

export default TokenInfo
