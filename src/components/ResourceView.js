import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { FormattedMessage } from 'react-intl'

import styled from 'styled-components'

import { Grid, Row, Col, ProgressBar } from 'react-bootstrap'

class ResourceView extends Component {
  render() {
    const { accountStore } = this.props

    return (
      <Fragment>
        {!accountStore.isLogin && (
          <Grid>
            <Row className="show-grid">
              <Col xs={12}>Please Login</Col>
            </Row>
          </Grid>
        )}
        {accountStore.isLogin && (
          <Grid>
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
          </Grid>
        )}
      </Fragment>
    )
  }
}

export default compose(
  inject('accountStore'),
  observer
)(ResourceView)
