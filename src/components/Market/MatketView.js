import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import { Grid, Row, Col } from 'react-bootstrap'

import MarketRow from './MarketRow'

class Market extends Component {
  render() {
    const { tokenList } = this.props

    return (
      <Grid>
        <Row classNam="show-grid">
          <Col xs={2}>
            <FormattedMessage id="Name" />
          </Col>
          <Col xs={2}>
            <FormattedMessage id="Last Price" />
          </Col>
          <Col xs={2}>
            <FormattedMessage id="24h Change" />
          </Col>
          <Col xs={2}>
            <FormattedMessage id="24h High" />
          </Col>
          <Col xs={2}>
            <FormattedMessage id="24h Low" />
          </Col>
          <Col xs={2}>
            <FormattedMessage id="24h Volume" />
          </Col>
        </Row>
        {tokenList.map((token, idx) => {
          return <MarketRow token={token} />
        })}
      </Grid>
    )
  }
}

export default Market
