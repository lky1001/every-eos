import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import { Grid, Row, Col } from 'react-bootstrap'

import RecourceView from '../ResourceView'
import MarketRow from './MarketRow'

class Market extends Component {
  render() {
    const { tokenList } = this.props

    return (
      <Grid>
        {/* test */}
        <RecourceView />
        <Row className="show-grid">
          <Col xs={2}>
            <FormattedMessage id="Name" />
          </Col>
          <Col xs={2}>
            <FormattedMessage id="Last Price" />
          </Col>
          <Col xs={2}>
            <FormattedMessage id="Today Change" />
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
        {tokenList.map(token => {
          return <MarketRow key={token.id} token={token} />
        })}
      </Grid>
    )
  }
}

export default Market
