import React, { Component, Fragment } from 'react'
import { Row, Col, Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router'
import { HeaderTable, PriceRow, TableMdRow } from '../Common/Common'
import { Scrollbars } from 'react-custom-scrollbars'
import ColorsConstant from '../Colors/ColorsConstant'
import styled from 'styled-components'

const BaseColumn = styled.td`
  text-align: left;
`

const FavoriteColumn = styled(BaseColumn)`
  width: 10%;
`

const PairColumn = styled(BaseColumn)`
  width: 45%;
  text-align: left;
`

const LastPriceColumn = styled(BaseColumn)`
  width: 25%;
  text-align: right;
`

const ChangeColumn = styled(BaseColumn)`
  width: 20%;
  text-align: right;
`

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
              <th style={{ width: '45%', textAlign: 'left' }}>
                <FormattedMessage id="Market" />
              </th>
              <th style={{ width: '25%', textAlign: 'right' }}>
                <FormattedMessage id="Last Price" />
              </th>
              <th style={{ width: '20%', textAlign: 'right' }}>
                <FormattedMessage id="Change" />
              </th>
            </tr>
          </thead>
        </HeaderTable>

        <Scrollbars style={{ height: '380px' }}>
          <Row style={{ height: '380px', margin: '0px' }}>
            <Col xs={12} md={12} style={{ padding: '0px' }}>
              <Table className="order-list-table responsive hover">
                <tbody>
                  {tokens &&
                    tokens.map((t, idx) => {
                      return (
                        <TableMdRow
                          key={idx}
                          className="msg-display clickable"
                          onClick={() => this.goTrade(t.symbol)}>
                          <FavoriteColumn>
                            <em data-pack="default" className="ion-android-star-outline" />
                          </FavoriteColumn>
                          <PairColumn style={{ textAlign: 'left' }}>
                            <PriceRow>
                              {t.symbol} / {t.market}
                            </PriceRow>
                          </PairColumn>
                          <LastPriceColumn>
                            {t.last_price - t.last_previous_price > 0 ? (
                              <PriceRow up>{t.last_price.toFixed(4)}</PriceRow>
                            ) : t.last_price - t.last_previous_price < 0 ? (
                              <PriceRow down>{t.last_price.toFixed(4)}</PriceRow>
                            ) : (
                              <PriceRow>{t.last_price.toFixed(4)}</PriceRow>
                            )}
                          </LastPriceColumn>

                          {/* 이쪽 변화율 계산 로직 TODO */}
                          <ChangeColumn>
                            {t.last_price - t.last_previous_price > 0 ? (
                              <PriceRow up>
                                {(t.last_price - t.last_previous_price).toFixed(2)} %
                              </PriceRow>
                            ) : t.last_price - t.last_previous_price < 0 ? (
                              <PriceRow down>
                                {(t.last_price - t.last_previous_price).toFixed(2)} %
                              </PriceRow>
                            ) : (
                              <PriceRow>{Number(0).toFixed(2)} %</PriceRow>
                            )}
                          </ChangeColumn>
                        </TableMdRow>
                      )
                    })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Scrollbars>
      </Fragment>
    )
  }
}

export default withRouter(Market)
