import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import StyledProgressbar from '../StyledProgressbar'

import { Row, Col } from 'react-bootstrap'

import styled from 'styled-components'

const ResourceProgress = styled.div`
  width: 50px;
  margin: auto;
  margin-bottom: 5px;
`

class Resource extends Component {
  render() {
    const { accountStore } = this.props
    const cpuUsageRate = ((accountStore.cpu.used / accountStore.cpu.max) * 100).toFixed(2)
    const netUsageRate = ((accountStore.net.used / accountStore.net.max) * 100).toFixed(2)
    const ramUsageRate = ((accountStore.ram.used / accountStore.ram.max) * 100).toFixed(2)

    return (
      <Fragment>
        {!accountStore.isLogin && (
          <Row className="show-grid">
            <Col xs={12} className="text-center">
              <h6 className="m0 text-thin">
                <FormattedMessage id="Please Login" />
              </h6>
            </Col>
          </Row>
        )}
        {accountStore.isLogin && (
          <Fragment>
            <Row className="show-grid">
              <Col xs={3} className="text-center" style={{ margin: 'auto' }}>
                <h6 className="m0 text-thin">
                  <FormattedMessage id="BALANCE" />
                </h6>
                <h6 className="m0">{`${accountStore.liquid} EOS`}</h6>
              </Col>
              <Col xs={3} className="text-center">
                <ResourceProgress>
                  <StyledProgressbar percentage={cpuUsageRate} text={`${cpuUsageRate}%`} />
                </ResourceProgress>
                {`${(accountStore.cpu.used / 1000).toFixed(4)} ms`} / {`${(accountStore.cpu.max / 1000).toFixed(4)} ms`}
                <br />
                CPU ({`${accountStore.totalResource.cpuWeight} EOS`})
              </Col>
              <Col xs={3} className="text-center">
                <ResourceProgress>
                  <StyledProgressbar percentage={netUsageRate} text={`${netUsageRate}%`} />
                </ResourceProgress>
                {`${(accountStore.net.used / 1024).toFixed(4)} KB`} / {`${(accountStore.net.max / 1024).toFixed(4)} KB`}
                <br />
                NET ({`${accountStore.totalResource.netWeight} EOS`})
              </Col>
              <Col xs={3} className="text-center">
                <ResourceProgress>
                  <StyledProgressbar percentage={ramUsageRate} text={`${ramUsageRate}%`} />
                </ResourceProgress>
                {`${(accountStore.ram.used / 1024).toFixed(4)} KB`} / {`${(accountStore.ram.max / 1024).toFixed(4)} KB`}
                <br />
                Memory
              </Col>
            </Row>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

export default Resource
