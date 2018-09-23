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
              <th style={{ width: '40%', textAlign: 'center' }}>
                <FormattedMessage id="Market" />
              </th>
              <th style={{ width: '30%', textAlign: 'center' }}>
                <FormattedMessage id="Last Price" />
              </th>
              <th style={{ width: '30%', textAlign: 'center' }}>
                <FormattedMessage id="Today Change" />
              </th>
            </tr>
          </thead>
        </HeaderTable>
        <Row style={{ height: '380px', overflow: 'hidden scroll' }}>
          <Col xs={12} md={12}>
            <Table responsive hover size="sm" className="order-list-table">
              <tbody>
                {tokens &&
                  tokens.map((t, idx) => {
                    return (
                      <tr
                        key={idx}
                        className="msg-display clickable"
                        onClick={() => this.goTrade(t.symbol)}
                      >
                        <td style={{ width: '40%' }}>
                          <PriceRow>
                            {t.symbol} / {t.market}
                          </PriceRow>
                        </td>
                        <td style={{ width: '30%', textAlign: 'right' }}>
                          <PriceRow>{t.last_price.toFixed(4)}</PriceRow>
                        </td>
                        <td style={{ width: '30%', textAlign: 'right' }}>
                          <PriceRow>{t.change_24h}</PriceRow>
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
