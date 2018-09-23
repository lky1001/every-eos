import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

import { Grid, Row, Col } from 'react-bootstrap'
import { ProgressBar } from 'react-bootstrap'
import TokenInfo from '../components/Trade/TokenInfo'
import Resource from '../components/Trade/Resource'
import OrderList from '../components/Trade/OrderList'
import Order from '../components/Trade/Order'
import TradingChart from '../components/Trade/TradingChart'
import Market from '../components/Trade/Market'
import Wallet from '../components/Trade/Wallet'
import OrderHistory from '../components/Trade/OrderHistory'
import OpenOrder from '../components/Trade/OpenOrder'
import { PAGE_SIZE_TEN } from '../constants/Values'

class TradePage extends Component {
  constructor(props) {
    super(props)
    const { token } = this.props.match.params

    this.state = {
      token: token,
      chartIntervalId: 0
    }
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

    return (
      <section>
        {token ? (
          <Grid style={{ minWidth: '1440px' }}>
            <Row className="bg-white content-heading" style={{ height: '116px' }}>
              <Col xs={12} md={7} style={{ borderRight: 'solid 1px #d9d9d9' }}>
                <TokenInfo marketStore={marketStore} symbol={token.symbol} />
              </Col>
              <Col xs={12} md={5} style={{ margin: 'auto' }}>
                <Resource accountStore={accountStore} />
              </Col>
            </Row>
            <Row style={{ height: '650px' }}>
              <Col
                xs={12}
                md={3}
                style={{
                  background: 'white',
                  border: 'solid 1px #d9d9d9'
                }}
              >
                <OrderList
                  token={token}
                  tradeStore={tradeStore}
                  buyOrdersList={tradeStore.buyOrdersList}
                  sellOrdersList={tradeStore.sellOrdersList}
                />
              </Col>
              <Col xs={12} md={6} style={{ height: '650px' }}>
                <Row
                  style={{
                    height: '500px',
                    background: 'white',
                    borderTop: 'solid 1px #d9d9d9',
                    borderBottom: 'solid 1px #d9d9d9'
                  }}
                >
                  <Col xs={12} md={12}>
                    {/* <TradingChart /> */}
                  </Col>
                </Row>
                <Row
                  style={{
                    height: '150px',
                    background: 'white',
                    borderBottom: 'solid 1px #d9d9d9'
                  }}
                >
                  <Col xs={12}>
                    <Order
                      token={token}
                      accountStore={accountStore}
                      tradeStore={tradeStore}
                      eosioStore={eosioStore}
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={3} style={{ height: '650px' }}>
                <Row
                  style={{
                    height: '400px',
                    overflow: 'hidden scroll',
                    border: 'solid 1px #d9d9d9',
                    background: 'white'
                  }}
                >
                  <Col xs={12}>
                    <Market marketStore={marketStore} />
                  </Col>
                </Row>
                <Row
                  style={{
                    height: '250px',
                    overflow: 'hidden scroll',
                    borderLeft: 'solid 1px #d9d9d9',
                    borderRight: 'solid 1px #d9d9d9',
                    borderBottom: 'solid 1px #d9d9d9',
                    background: 'white'
                  }}
                >
                  <Col xs={12}>
                    <Wallet
                      accountStore={accountStore}
                      marketStore={marketStore}
                      eosioStore={eosioStore}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12}>
                <Row
                  style={{
                    background: 'white',
                    borderLeft: 'solid 1px #d9d9d9',
                    borderRight: 'solid 1px #d9d9d9'
                  }}
                >
                  <Col xs={12}>
                    <OpenOrder
                      tradeStore={tradeStore}
                      openOrdersList={tradeStore.openOrdersList}
                      openOrdersCount={tradeStore.openOrdersCount}
                      openOrdersLoading={tradeStore.openOrdersLoading}
                      openOrdersError={tradeStore.openOrdersError}
                      accountStore={accountStore}
                    />
                  </Col>
                </Row>
                <Row
                  style={{
                    overflow: 'hidden scroll',
                    background: 'white',
                    border: 'solid 1px #d9d9d9'
                  }}
                >
                  <Col xs={12}>
                    <OrderHistory
                      accountStore={accountStore}
                      tradeStore={tradeStore}
                      ordersHistoryList={tradeStore.ordersHistoryList}
                      ordersHistoryCount={tradeStore.ordersHistoryCount}
                      ordersHistoryLoading={tradeStore.ordersHistoryLoading}
                      ordersHistoryError={tradeStore.ordersHistoryError}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Grid>
        ) : (
          ''
        )}
      </section>
    )
  }
}

export default compose(
  inject('marketStore', 'eosioStore', 'tradeStore', 'accountStore'),
  observer
)(TradePage)
