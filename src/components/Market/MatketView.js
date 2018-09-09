import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Grid, Row, Col } from 'react-bootstrap'

import { ProgressBar } from 'react-bootstrap'
import RecourceView from '../ResourceView'
import MarketRow from './MarketRow'

class MarketView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      intervalId: 0
    }
  }

  componentDidMount = async () => {
    const { marketStore } = this.props

    const id = setInterval(async () => {
      await marketStore.getTokens()
    }, 2000)

    this.setState({
      intervalId: id
    })
  }

  componentWillUnmount = async () => {
    if (this.state.intervalId > 0) {
      clearInterval(this.state.intervalId)
    }
  }

  render() {
    const { marketStore } = this.props
    const { tokenList } = marketStore

    return !tokenList ? (
      <ProgressBar striped bsStyle="success" now={40} />
    ) : (
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

export default compose(
  inject('marketStore'),
  observer
)(MarketView)
