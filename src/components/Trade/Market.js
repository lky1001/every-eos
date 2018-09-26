import React, { Component, Fragment } from 'react'
import { Row, Col, Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router'
import { HeaderTable, PriceRow } from '../Common/Common'

class Market extends Component {
  goTrade = symbol => {
    // todo - router
    //this.props.history.push('/trades/' + symbol)
    window.location = '/trades/' + symbol
  }

  render() {
    const { tokens } = this.props

    return (
      <Fragment>
        <HeaderTable className="table order-list-table">
          <thead>
            <tr>
              <th style={{ width: '10%' }} />
              <th style={{ width: '40%', textAlign: 'left' }}>
                <FormattedMessage id="Market" />
              </th>
              <th style={{ width: '25%', textAlign: 'right' }}>
                <FormattedMessage id="Last Price" />
              </th>
              <th style={{ width: '25%', textAlign: 'right' }}>
                <FormattedMessage id="Change" />
              </th>
            </tr>
          </thead>
        </HeaderTable>
        <Row style={{ height: '380px', overflow: 'hidden scroll', margin: '0px' }}>
          <Col xs={12} md={12} style={{ padding: '0px' }}>
            <Table responsive hover size="sm" className="order-list-table">
              <tbody>
                {tokens &&
                  tokens.map((t, idx) => {
                    return (
                      <tr
                        key={idx}
                        className="msg-display clickable"
                        onClick={() => this.goTrade(t.symbol)}>
                        <td style={{ width: '10%' }}>
                          <em data-pack="default" className="ion-ios-star-outline" />
                        </td>
                        <td style={{ width: '40%', textAlign: 'left' }}>
                          <PriceRow>
                            {t.symbol} / {t.market}
                          </PriceRow>
                        </td>
                        <td style={{ width: '25%', textAlign: 'right' }}>
                          {t.last_price - t.last_previous_price > 0 ? (
                            <PriceRow up>{t.last_price.toFixed(4)}</PriceRow>
                          ) : t.last_price - t.last_previous_price < 0 ? (
                            <PriceRow down>{t.last_price.toFixed(4)}</PriceRow>
                          ) : (
                            <PriceRow>{t.last_price.toFixed(4)}</PriceRow>
                          )}
                        </td>

                        {/* 이쪽 변화율 계산 로직 TODO */}
                        <td style={{ width: '25%', textAlign: 'right' }}>
                          {t.last_price - t.last_previous_price > 0 ? (
                            <PriceRow up>
                              {(t.last_price - t.last_previous_price).toFixed(2)} %
                            </PriceRow>
                          ) : t.last_price - t.last_previous_price < 0 ? (
                            <PriceRow down>
                              {(t.last_price - t.last_previous_price).toFixed(2)} %
                            </PriceRow>
                          ) : (
                            <PriceRow>{Number(0).tofix(2)} %</PriceRow>
                          )}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Fragment>
    )
  }
}

export default withRouter(Market)
