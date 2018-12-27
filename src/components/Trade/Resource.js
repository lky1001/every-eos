import React, { PureComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import StyledProgressbar from '../StyledProgressbar'
import { inject, observer } from 'mobx-react'
import { Row, Col } from 'react-bootstrap'

import styled from 'styled-components'

const ResourceProgress = styled.div`
  width: 60px;
  text-align: center;
  font-size: 15px;
`

const TokenInfoTitle = styled.h6`
  font-size: 1.25rem;
  padding: 0;
  margin: 0;
`

const TokenSymbolText = styled.small`
  font-size: 1.5rem;
`

class Resource extends PureComponent {
  render() {
    const { isLogin, liquid, cpu, net, ram, height } = this.props
    let cpuUsageRate
    let netUsageRate
    let ramUsageRate

    if (isLogin) {
      cpuUsageRate = ((cpu.used / cpu.max) * 100).toFixed(2)
      netUsageRate = ((net.used / net.max) * 100).toFixed(2)
      ramUsageRate = ((ram.used / ram.max) * 100).toFixed(2)
    }

    return (
      <Fragment>
        {!isLogin ? (
          <Row className="show-grid" style={{ height: '90px' }}>
            <Col xs={12} className="text-center" style={{ margin: 'auto' }}>
              <h6 className="m0">
                <FormattedMessage id="Please Login" />
              </h6>
            </Col>
          </Row>
        ) : (
          <div
            style={{
              height,
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center'
            }}>
            <div style={{ textAlign: 'center' }}>
              <TokenInfoTitle>
                <FormattedMessage id="BALANCE" />
              </TokenInfoTitle>
              <TokenSymbolText>{`${liquid} EOS`}</TokenSymbolText>
            </div>

            <div>
              <ResourceProgress>CPU Usage {`${cpuUsageRate}%`}</ResourceProgress>
              {/* {`${(accountStore.cpu.used / 1000).toFixed(4)} ms`} /{' '}
              {`${(accountStore.cpu.max / 1000).toFixed(4)} ms`}
              <br />
              CPU ({`${accountStore.totalResource.cpuWeight} EOS`}) */}
            </div>

            <div>
              <ResourceProgress>NET Usage {`${netUsageRate}%`}</ResourceProgress>
              {/* {`${(accountStore.net.used / 1024).toFixed(4)} KB`} /{' '}
              {`${(accountStore.net.max / 1024).toFixed(4)} KB`}
              <br />
              NET ({`${accountStore.totalResource.netWeight} EOS`}) */}
            </div>

            <div>
              <ResourceProgress>RAM Usage {`${ramUsageRate}%`}</ResourceProgress>
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

export default inject(({ accountStore }) => ({
  isLogin: accountStore.isLogin,
  liquid: accountStore.liquid,
  cpu: accountStore.cpu,
  net: accountStore.net,
  ram: accountStore.ram
}))(observer(Resource))
