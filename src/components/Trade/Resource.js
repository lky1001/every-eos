import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { Row, Col } from 'react-bootstrap'

class Resource extends Component {
  render() {
    const { accountStore } = this.props

    return (
      <Fragment>
        {!accountStore.isLogin && (
          <Row className="show-grid">
            <Col xs={12}>
              <FormattedMessage id="Please Login" />
            </Col>
          </Row>
        )}
        {accountStore.isLogin && (
          <Fragment>
            <Row className="show-grid">
              <Col xs={2}>EOS</Col>
              <Col xs={2}>Cpu</Col>
              <Col xs={2}>Net</Col>
              <Col xs={2}>Ram</Col>
            </Row>
            <Row className="show-grid">
              <Col xs={2}>{accountStore.liquid}</Col>
              <Col xs={2}>
                {accountStore.cpu.available}/{accountStore.cpu.max}
              </Col>
              <Col xs={2}>
                {accountStore.net.available}/{accountStore.net.max}
              </Col>
              <Col xs={2}>
                {accountStore.ram.available}/{accountStore.ram.max}
              </Col>
            </Row>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

export default Resource
