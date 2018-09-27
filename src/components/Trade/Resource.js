import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import StyledProgressbar from '../StyledProgressbar'

import { Row, Col } from 'react-bootstrap'

import styled from 'styled-components'

const ResourceProgress = styled.div`
  width: 60px;
`

const TokenInfoTitle = styled.h6`
  font-size: 1.25rem;
  padding: 0;
  margin: 0;
`

const TokenSymbolText = styled.small`
  font-size: 1.5rem;
`

class Resource extends Component {
  render() {
    const { accountStore, height } = this.props
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
          <div
            style={{
              height,
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center'
            }}>
            <div>
              <TokenInfoTitle>
                <FormattedMessage id="BALANCE" />
              </TokenInfoTitle>
              <TokenSymbolText>{`${accountStore.liquid} EOS`}</TokenSymbolText>
            </div>

            <div>
              <ResourceProgress>
                <StyledProgressbar percentage={cpuUsageRate} text={`${cpuUsageRate}%`} />
              </ResourceProgress>
              {/* {`${(accountStore.cpu.used / 1000).toFixed(4)} ms`} /{' '}
              {`${(accountStore.cpu.max / 1000).toFixed(4)} ms`}
              <br />
              CPU ({`${accountStore.totalResource.cpuWeight} EOS`}) */}
            </div>

            <div>
              <ResourceProgress>
                <StyledProgressbar percentage={netUsageRate} text={`${netUsageRate}%`} />
              </ResourceProgress>
              {/* {`${(accountStore.net.used / 1024).toFixed(4)} KB`} /{' '}
              {`${(accountStore.net.max / 1024).toFixed(4)} KB`}
              <br />
              NET ({`${accountStore.totalResource.netWeight} EOS`}) */}
            </div>

            <div>
              <ResourceProgress>
                <StyledProgressbar percentage={ramUsageRate} text={`${ramUsageRate}%`} />
              </ResourceProgress>
              {/* {`${(accountStore.ram.used / 1024).toFixed(4)} KB`} /{' '}
              {`${(accountStore.ram.max / 1024).toFixed(4)} KB`}
              <br />
              Memory */}
            </div>
          </div>
        )}
      </Fragment>
    )
  }
}

export default Resource
