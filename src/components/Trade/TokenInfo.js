import React, { Component, Fragment } from 'react'
import { Row, Col } from 'react-bootstrap'
import styled from 'styled-components'
import ColorsConstant from '../Colors/ColorsConstant'

const TokenInfoTitle = styled.h6`
  font-size: 1.35rem;
  padding: 0;
  margin: 0;
`

const TokenSymbolText = styled.small`
  font-size: 1.5rem;
  color: ${props => (props.up ? ColorsConstant.Thick_green : props.down ? ColorsConstant.Thick_red : ColorsConstant.Thick_normal)};
`

class TokenInfo extends Component {
  componentDidMount = async () => {
    const { symbol, marketStore } = this.props

    await marketStore.getTokenBySymbol(symbol)
  }

  render() {
    const { marketStore, height } = this.props
    const token = marketStore.token ? marketStore.token.data.token : null
    const todayChanged = token ? token.last_price - token.last_day_price : 0.0

    return (
      <Fragment>
        {token && (
          <div
            style={{
              height,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around'
            }}
          >
            <div>
              <TokenInfoTitle>Last Price</TokenInfoTitle>
              <TokenSymbolText up={token.last_price - token.last_previous_price > 0} down={token.last_price - token.last_previous_price < 0}>
                {token.last_price.toFixed(4)} EOS
              </TokenSymbolText>
            </div>
            <div>
              <TokenInfoTitle>Today Changed</TokenInfoTitle>
              <TokenSymbolText up={todayChanged > 0} down={todayChanged < 0}>
                {todayChanged.toFixed(4)} EOS
              </TokenSymbolText>
            </div>
            <div>
              <TokenInfoTitle>Today High</TokenInfoTitle>
              <TokenSymbolText>{token.high_price_24h.toFixed(4)} EOS</TokenSymbolText>
            </div>
            <div>
              <TokenInfoTitle>Today Low</TokenInfoTitle>
              <TokenSymbolText>{token.low_price_24h.toFixed(4)} EOS</TokenSymbolText>
            </div>
            <div>
              <TokenInfoTitle>Today Volume</TokenInfoTitle>
              <TokenSymbolText>{token.volume_24h.toFixed(4)} EOS</TokenSymbolText>
            </div>
          </div>
        )}
      </Fragment>
    )
  }
}

export default TokenInfo
