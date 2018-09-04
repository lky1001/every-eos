import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import styled from 'styled-components'

import { Row, Col } from 'react-bootstrap'

const Text = styled.span`
  color: ${props => props.color};
`

class MarketRow extends Component {
  render() {
    const { token } = this.props

    return (
      <Row classNam="show-grid">
        <Col xs={2}>{token.name}</Col>
        <Col xs={2}>
          <Text>{token.last_price}</Text>
        </Col>
        <Col xs={2}>
          <FormattedMessage id="24h Change" />
        </Col>
        <Col xs={2}>{token.high_price_24h}</Col>
        <Col xs={2}>{token.low_price_24h}</Col>
        <Col xs={2}>{token.volume_24h}</Col>
      </Row>
    )
  }
}

export default MarketRow
