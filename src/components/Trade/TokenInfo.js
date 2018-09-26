import React, { Component, Fragment } from 'react'
import { Row, Col } from 'react-bootstrap'
import styled from 'styled-components'

const TokenInfoText = styled.h6`
  font-size: 15px;
`

const TokenSymbolText = styled.small`
  font-size: 16px;
`

class TokenInfo extends Component {
  componentDidMount = async () => {
    const { symbol, marketStore } = this.props

    await marketStore.getTokenBySymbol(symbol)
  }

  render() {
    const { marketStore } = this.props
    const token = marketStore.token ? marketStore.token.data.token : null
    const todayChanged = token ? token.last_day_price - token.last_price : 0.0

    return (
      <Fragment>
        {token && (
          <Row style={{ marginTop: '25px' }}>
            <Col xs={2} style={{ marginTop: '4px' }}>
              <h5 className="m0">{token.name}</h5>
              <TokenSymbolText>{token.symbol}</TokenSymbolText>
            </Col>
            <Col xs={2}>
              <TokenInfoText className="m0 text-thin">Last Price</TokenInfoText>
              <TokenSymbolText>{token.last_price} EOS</TokenSymbolText>
            </Col>
            <Col xs={2}>
              <TokenInfoText className="m0 text-thin">Today Changed</TokenInfoText>
              <TokenSymbolText>{todayChanged.toFixed(4)} EOS</TokenSymbolText>
            </Col>
            <Col xs={2}>
              <TokenInfoText className="m0 text-thin">Today High</TokenInfoText>
              <TokenSymbolText>{token.high_price_24h.toFixed(4)} EOS</TokenSymbolText>
            </Col>
            <Col xs={2}>
              <TokenInfoText className="m0 text-thin">Today Low</TokenInfoText>
              <TokenSymbolText>{token.low_price_24h.toFixed(4)} EOS</TokenSymbolText>
            </Col>
            <Col xs={2}>
              <TokenInfoText className="m0 text-thin">Today Volume</TokenInfoText>
              <TokenSymbolText>{token.volume_24h.toFixed(4)} EOS</TokenSymbolText>
            </Col>
          </Row>
        )}
      </Fragment>
    )
  }
}

export default TokenInfo
