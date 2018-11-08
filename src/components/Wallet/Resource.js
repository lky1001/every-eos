import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import StyledProgressbar from '../StyledProgressbar'
import NumberFormat from 'react-number-format'
import { Row, Col, Button } from 'react-bootstrap'
import { EOS_TOKEN } from '../../constants/Values'
import styled from 'styled-components'

const ResourceProgress = styled.div`
  width: 80px;
  margin: auto;
`

const ResourceText = styled.p`
  font-size: 15px;
`

const ResourceActionButton = styled(Button)`
  height: 35px;
  font-size: 15px;
`

class Resource extends Component {
  render() {
    const { accountStore } = this.props
    const cpuUsageRate = ((accountStore.cpu.used / accountStore.cpu.max) * 100).toFixed(2)
    const netUsageRate = ((accountStore.net.used / accountStore.net.max) * 100).toFixed(2)
    const ramUsageRate = ((accountStore.ram.used / accountStore.ram.max) * 100).toFixed(2)

    return (
      <Fragment>
        {!accountStore.isLogin ? (
          <Row className="show-grid" style={{ height: '90px' }}>
            <Col xs={12} className="text-center" style={{ margin: 'auto' }}>
              <h6 className="m0">
                <FormattedMessage id="Please Login" />
              </h6>
            </Col>
          </Row>
        ) : (
          <Fragment>
            <Row>
              <Col xs={12}>
                <div className="card">
                  <div className="card-heading bg-primary">
                    <div className="card-title">CPU</div>
                  </div>
                  <div className="card-offset">
                    <div className="card-offset-item text-right">
                      <a href="https://www.eosuite.app/account/staking" target="_blank">
                        <ResourceActionButton bsStyle="success" className="btn-oval mr ripple">
                          <FormattedMessage id="Stake" />
                        </ResourceActionButton>
                      </a>
                    </div>
                  </div>
                  <div className="card-body pt0">
                    <Row>
                      <Col xs={4}>
                        <ResourceProgress>
                          <StyledProgressbar percentage={cpuUsageRate} text={`${cpuUsageRate}%`} />
                        </ResourceProgress>
                      </Col>
                      <Col xs={8}>
                        <ResourceText>
                          <FormattedMessage id="Staked" /> :{' '}
                          <NumberFormat
                            displayType={'text'}
                            suffix=" EOS"
                            value={accountStore.totalCpuStaked}
                            fixedDecimalScale={true}
                            decimalScale={EOS_TOKEN.precision}
                          />
                        </ResourceText>
                        <ResourceText>
                          <FormattedMessage id="Used" /> :{' '}
                          <NumberFormat displayType={'text'} suffix=" us" value={accountStore.cpu.used} thousandSeparator={true} />
                        </ResourceText>
                        <ResourceText>
                          <FormattedMessage id="Max" /> :{' '}
                          <NumberFormat displayType={'text'} suffix=" us" value={accountStore.cpu.max} thousandSeparator={true} />
                        </ResourceText>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className="card">
                  <div className="card-heading bg-primary">
                    <div className="card-title">NET</div>
                  </div>
                  <div className="card-offset">
                    <div className="card-offset-item text-right">
                      <a href="https://www.eosuite.app/account/staking" target="_blank">
                        <ResourceActionButton bsStyle="success" className="btn-oval mr ripple">
                          <FormattedMessage id="Stake" />
                        </ResourceActionButton>
                      </a>
                    </div>
                  </div>
                  <div className="card-body pt0">
                    <Row>
                      <Col xs={4}>
                        <ResourceProgress>
                          <StyledProgressbar percentage={netUsageRate} text={`${netUsageRate}%`} />
                        </ResourceProgress>
                      </Col>
                      <Col xs={8}>
                        <ResourceText>
                          <FormattedMessage id="Staked" /> :{' '}
                          <NumberFormat
                            displayType={'text'}
                            suffix=" EOS"
                            value={accountStore.totalNetStaked}
                            fixedDecimalScale={true}
                            decimalScale={EOS_TOKEN.precision}
                          />
                        </ResourceText>
                        <ResourceText>
                          <FormattedMessage id="Used" /> :{' '}
                          <NumberFormat displayType={'text'} suffix=" bytes" value={accountStore.net.used} thousandSeparator={true} />
                        </ResourceText>
                        <ResourceText>
                          <FormattedMessage id="Max" /> :{' '}
                          <NumberFormat displayType={'text'} suffix=" bytes" value={accountStore.net.max} thousandSeparator={true} />
                        </ResourceText>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className="card">
                  <div className="card-heading bg-primary">
                    <div className="card-title">RAM</div>
                  </div>
                  <div className="card-offset">
                    <div className="card-offset-item text-right">
                      <a href="https://www.eosuite.app/account/rammarket" target="_blank">
                        <ResourceActionButton bsStyle="success" className="btn-oval mr ripple">
                          <FormattedMessage id="Manage" />
                        </ResourceActionButton>
                      </a>
                    </div>
                  </div>
                  <div className="card-body pt0">
                    <Row>
                      <Col xs={4}>
                        <ResourceProgress>
                          <StyledProgressbar percentage={ramUsageRate} text={`${ramUsageRate}%`} />
                        </ResourceProgress>
                      </Col>
                      <Col xs={8}>
                        <ResourceText>
                          <FormattedMessage id="Used" /> :{' '}
                          <NumberFormat
                            displayType={'text'}
                            suffix=" KB"
                            value={accountStore.ram.used / 1024}
                            thousandSeparator={true}
                            fixedDecimalScale={true}
                            decimalScale={4}
                          />
                        </ResourceText>
                        <ResourceText>
                          <FormattedMessage id="Max" /> :{' '}
                          <NumberFormat
                            displayType={'text'}
                            suffix=" KB"
                            value={accountStore.ram.max / 1024}
                            thousandSeparator={true}
                            fixedDecimalScale={true}
                            decimalScale={4}
                          />
                        </ResourceText>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

export default Resource
