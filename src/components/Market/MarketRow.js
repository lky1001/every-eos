import React, { Component } from 'react'

import styled from 'styled-components'

import { Row, Col } from 'react-bootstrap'

const Text = styled.span`
  color: ${props => props.color};
`

class MarketRow extends Component {
  render() {
    const { token } = this.props
    const todayChanged = token.last_day_price - token.last_price

    return (
      <Row className="show-grid">
        <Col xs={2}>{token.name}</Col>
        <Col xs={2}>
          <Text color={todayChanged > 0 ? 'Red' : 'Blue'}>{token.last_price}</Text>
        </Col>
        <Col xs={2}>
          <Text>{todayChanged}</Text>
        </Col>
        <Col xs={2}>{token.high_price_24h}</Col>
        <Col xs={2}>{token.low_price_24h}</Col>
        <Col xs={2}>{token.volume_24h}</Col>
      </Row>
    )
  }
}

export default MarketRow
