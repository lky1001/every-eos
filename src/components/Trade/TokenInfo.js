import React, { Component, Fragment } from 'react'
import { Row, Col } from 'react-bootstrap'
import styled from 'styled-components'

const TokenInfoText = styled.h6`
  font-size: 14px;
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
              <h5 className="m0 text-thin">{token.name}</h5>
              <small>{token.symbol}</small>
            </Col>
            <Col xs={2}>
              <TokenInfoText className="m0 text-thin">Last Price</TokenInfoText>
              {token.last_price} EOS
            </Col>
            <Col xs={2}>
              <TokenInfoText className="m0 text-thin">Today Changed</TokenInfoText>
              {todayChanged} EOS
            </Col>
            <Col xs={2}>
              <TokenInfoText className="m0 text-thin">Today High</TokenInfoText>
              {token.high_price_24h} EOS
            </Col>
            <Col xs={2}>
              <TokenInfoText className="m0 text-thin">Today Low</TokenInfoText>
              {token.low_price_24h} EOS
            </Col>
            <Col xs={2}>
              <TokenInfoText className="m0 text-thin">Today Volume</TokenInfoText>
              {token.volume_24h} EOS
            </Col>
          </Row>
        )}
      </Fragment>
    )
  }
}

export default TokenInfo
