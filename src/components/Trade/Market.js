import React, { PureComponent, Fragment } from 'react'
import { Row, Col, Table } from 'react-bootstrap'
import NumberFormat from 'react-number-format'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router'
import { HeaderTable, PriceRow, TableMdRow } from '../Common/Common'
import { Scrollbars } from 'react-custom-scrollbars'
import { EOS_TOKEN } from '../../constants/Values'
import ColorsConstant from '../Colors/ColorsConstant.js'
import { withCookies, Cookies } from 'react-cookie'
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

class Market extends PureComponent {
  constructor(props) {
    super(props)
    const { cookies } = props

    this.state = {
      favorites: cookies.get('favorites') || []
    }
  }

  goTrade = symbol => {
    this.props.history.push('/trades/' + symbol)
  }

  handleFavorite = symbol => {
    const { cookies } = this.props
    const { favorites } = this.state

    const targetIndex = favorites.indexOf(symbol)
    let newFavorites = []

    if (targetIndex !== -1) {
      newFavorites = favorites.filter(f => f !== symbol)
    } else {
      newFavorites = favorites.concat(symbol)
    }

    cookies.set('favorites', newFavorites, { path: '/' })
    this.setState({ favorites: newFavorites })
  }

  render() {
    const { tokens } = this.props
    const { favorites } = this.state

    let favoriteTokens = []

    if (tokens) {
      favoriteTokens = tokens.filter(t => favorites.some(f => f === t.symbol))
    }

    return (
      <Fragment>
        <HeaderTable className="table order-list-table" background={ColorsConstant.grayLighter}>
          <thead>
            <tr style={{ height: '46px' }}>
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
                          onClick={e => this.goTrade(t.symbol)}>
                          <FavoriteColumn
                            onClick={e => {
                              e.stopPropagation()
                              this.handleFavorite(t.symbol)
                            }}>
                            <em
                              data-pack="default"
                              className={
                                favoriteTokens.some(target => target.symbol === t.symbol)
                                  ? 'ion-android-star'
                                  : 'ion-android-star-outline'
                              }
                              style={{
                                fontSize: '1.5rem',
                                textAlign: 'center'
                              }}
                            />
                          </FavoriteColumn>
                          <PairColumn style={{ textAlign: 'left' }}>
                            <PriceRow>
                              {t.symbol} / {t.market}
                            </PriceRow>
                          </PairColumn>
                          <LastPriceColumn>
                            <PriceRow
                              up={t.last_price - t.last_previous_price > 0}
                              down={t.last_price - t.last_previous_price < 0}>
                              <NumberFormat
                                displayType={'text'}
                                suffix=" EOS"
                                value={t.last_price}
                                fixedDecimalScale={true}
                                decimalScale={EOS_TOKEN.precision}
                              />
                            </PriceRow>
                          </LastPriceColumn>

                          {/* 이쪽 변화율 계산 로직 TODO */}
                          <ChangeColumn>
                            <PriceRow
                              up={t.last_price - t.last_day_price > 0}
                              down={t.last_price - t.last_day_price < 0}>
                              <NumberFormat
                                displayType={'text'}
                                prefix={t.last_price - t.last_day_price < 0 ? '-' : ''}
                                suffix="%"
                                value={
                                  t.last_price - t.last_day_price === 0
                                    ? 0
                                    : (Math.abs(t.last_day_price - t.last_price) /
                                        t.last_day_price) *
                                      100
                                }
                                fixedDecimalScale={true}
                                decimalScale={2}
                              />
                            </PriceRow>
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

export default withRouter(withCookies(Market))
