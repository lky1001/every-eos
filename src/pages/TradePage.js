import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { withRouter } from 'react-router'

import { NoPaddingCol, NoMarginPaddingCol } from '../components/Common/Common'
import { Grid, Row, Col } from 'react-bootstrap'
import TokenInfo from '../components/Trade/TokenInfo'
import TokenThumbnailInfo from '../components/Trade/TokenThumbnailInfo'
import Resource from '../components/Trade/Resource'
import OrderList from '../components/Trade/OrderList'
import Order from '../components/Trade/Order'
import { TVChartContainer } from '../components/TVChartContainer/index'
import Market from '../components/Trade/Market'
import LastTradeList from '../components/Trade/LastTradeList'
import OrderHistory from '../components/Trade/OrderHistory'
import OpenOrder from '../components/Trade/OpenOrder'

import ColorsConstant from '../components/Colors/ColorsConstant'

import { PAGE_SIZE_TEN } from '../constants/Values'

class TradePage extends Component {
  constructor(props) {
    super(props)
    const { token } = this.props.match.params

    this.state = {
      token: token,
      chartIntervalId: 0
    }

    this.props.history.listen(async (location, action) => {
      const token = location.pathname.replace('/trades/', '')
      const { marketStore, tradeStore } = this.props

      this.state = {
        token: token
      }

      tradeStore.setTokenSymbol(token)
      await marketStore.getTokenBySymbol(token)

      this.forceUpdate()
    })
  }

  componentDidMount = async () => {
    const { marketStore, tradeStore, accountStore } = this.props

    tradeStore.setTokenSymbol(this.state.token)
    await marketStore.getTokenBySymbol(this.state.token)

    this.disposer = accountStore.subscribeLoginState(changed => {
      if (changed.oldValue !== changed.newValue) {
        this.forceUpdate()
      }
    })
  }

  componentWillUnmount = () => {
    if (this.disposer) {
      this.disposer()
    }
  }

  render() {
    const { accountStore, marketStore, tradeStore, eosioStore } = this.props

    const token = marketStore.token
      ? marketStore.token.data
        ? marketStore.token.data.token
        : null
      : null

    const tokens = marketStore.tokens
      ? marketStore.tokens.data
        ? marketStore.tokens.data.tokens
        : null
      : null

    const height = '90px'

    return (
      <section>
        {token && (
          <Grid style={{ minWidth: '1440px' }}>
            <Row
              style={{
                height,
                borderLeft: ColorsConstant.Trade_border_style,
                borderRight: ColorsConstant.Trade_border_style
              }}
            >
              <Col
                md={3}
                style={{
                  borderRight: ColorsConstant.Trade_border_style
                }}
              >
                <TokenThumbnailInfo
                  marketStore={marketStore}
                  symbol={token.symbol}
                  height={height}
                />
              </Col>
              <Col md={6}>
                <TokenInfo marketStore={marketStore} symbol={token.symbol} height={height} />
              </Col>
              <Col md={3} style={{ borderLeft: ColorsConstant.Trade_border_style }}>
                <Resource accountStore={accountStore} height={height} />
              </Col>
            </Row>
            <Row
              style={{
                height: '674px',
                borderLeft: ColorsConstant.Trade_border_style,
                borderRight: ColorsConstant.Trade_border_style
              }}
            >
              <NoPaddingCol className="col-md-3" showBorderRight showBorderTop showBorderBottom>
                <OrderList
                  token={token}
                  tradeStore={tradeStore}
                  buyOrdersList={tradeStore.buyOrdersList}
                  sellOrdersList={tradeStore.sellOrdersList}
                />
              </NoPaddingCol>
              <Col md={6} style={{ height: '674px' }}>
                <Row
                  style={{
                    height: '380px',
                    background: 'white',
                    borderTop: ColorsConstant.Trade_border_style
                  }}
                >
                  <Col md={12}>
                    {/* 여기에 DataFeed 바인딩 할 것 */}
                    <TVChartContainer accountStore={accountStore} tradeStore={tradeStore} />
                    {/* <TradingChart /> */}
                  </Col>
                </Row>
                <Row
                  style={{
                    height: '280px',
                    background: 'white'
                  }}
                >
                  <NoMarginPaddingCol xs={12}>
                    <Order
                      token={token}
                      accountStore={accountStore}
                      tradeStore={tradeStore}
                      eosioStore={eosioStore}
                    />
                  </NoMarginPaddingCol>
                </Row>
              </Col>
              <Col md={3} style={{ height: '674px' }}>
                <Row
                  style={{
                    height: '410px',
                    background: 'white'
                  }}
                >
                  <NoPaddingCol className="col-md-12" showBorderLeft showBorderTop showBorderBottom>
                    <Market tokens={tokens} />
                  </NoPaddingCol>
                </Row>
                <Row>
                  <NoPaddingCol className="col-md-12" showBorderLeft showBorderBottom>
                    <LastTradeList token={token} tradeStore={tradeStore} />
                  </NoPaddingCol>
                </Row>
              </Col>
            </Row>
            <Row
              style={{
                borderLeft: ColorsConstant.Trade_border_style,
                borderRight: ColorsConstant.Trade_border_style
              }}
            >
              <Col xs={12} md={12}>
                <Row
                  style={{
                    background: 'white'
                  }}
                >
                  <NoMarginPaddingCol xs={12}>
                    <OpenOrder
                      accountStore={accountStore}
                      tradeStore={tradeStore}
                      openOrdersList={tradeStore.openOrdersList}
                      openOrdersCount={tradeStore.openOrdersCount}
                      openOrdersTotalCount={tradeStore.openOrdersTotalCount}
                      openOrdersLoading={tradeStore.openOrdersLoading}
                      openOrdersError={tradeStore.openOrdersError}
                    />
                  </NoMarginPaddingCol>
                </Row>
                <Row
                  style={{
                    background: 'white'
                  }}
                >
                  <NoMarginPaddingCol xs={12}>
                    <OrderHistory
                      accountStore={accountStore}
                      tradeStore={tradeStore}
                      ordersHistoryList={tradeStore.ordersHistoryList}
                      ordersHistoryCount={tradeStore.ordersHistoryCount}
                      ordersHistoryTotalCount={tradeStore.ordersHistoryTotalCount}
                      ordersHistoryLoading={tradeStore.ordersHistoryLoading}
                      ordersHistoryError={tradeStore.ordersHistoryError}
                      ordersHistoryPage={tradeStore.ordersHistoryPage}
                      ordersHistoryPageSize={tradeStore.ordersHistoryPageSize}
                      ordersHistoryFrom={tradeStore.ordersHistoryFrom}
                      ordersHistoryTo={tradeStore.ordersHistoryTo}
                      ordersHistoryType={tradeStore.ordersHistoryType}
                      ordersHistoryStatus={tradeStore.ordersHistoryStatus}
                      tokenSymbolForSearch={tradeStore.tokenSymbolForSearch}
                    />
                  </NoMarginPaddingCol>
                </Row>
              </Col>
            </Row>
          </Grid>
        )}
      </section>
    )
  }
}

export default withRouter(
  compose(
    inject('marketStore', 'eosioStore', 'tradeStore', 'accountStore'),
    observer
  )(TradePage)
)
