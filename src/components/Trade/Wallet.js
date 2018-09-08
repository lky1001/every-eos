import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { Row, Col } from 'reactstrap'

class Wallet extends Component {
  componentDidUpdate = () => {
    console.log('test')
  }

  render() {
    const { accountStore, marketStore } = this.props

    const tokens = marketStore.tokens
      ? marketStore.tokens.data
        ? marketStore.tokens.data.tokens
        : null
      : null

    return (
      <Fragment>
        <Row>
          <Col xs={12}>
            <FormattedMessage id="Wallet" />
          </Col>
        </Row>
        {!accountStore.isLogin && <FormattedMessage id="Please Login" />}
        {accountStore.isLogin &&
          tokens &&
          tokens.map((token, idx) => {
            return (
              <Row>
                <Col xs={8}>{token.name}</Col>
                <Col xs={4}>0.0000</Col>
              </Row>
            )
          })}
      </Fragment>
    )
  }
}

export default Wallet
