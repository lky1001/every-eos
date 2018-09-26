import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Text } from '../Common/Common'
import ColorsConstant from '../Colors/ColorsConstant.js'

class MarketRow extends Component {
  render() {
    const { token } = this.props
    const todayChanged = token.last_day_price - token.last_price

    return (
      <Row className="show-grid">
        <Col xs={2}>{token.name}</Col>
        <Col xs={2}>
          <Text color={todayChanged > 0 ? ColorsConstant.Thick_green : ColorsConstant.Thick_red}>
            {token.last_price}
          </Text>
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
