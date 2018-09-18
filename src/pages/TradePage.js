import React, { Component, Fragment } from 'react'
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
      <Fragment>
        {token ? (
          <Grid>
            <Row>
              <Col xs={12} md={8} style={{ background: '#a9a9a9' }}>
                <TokenInfo marketStore={marketStore} symbol={token.symbol} />
              </Col>
              <Col xs={12} md={4} style={{ background: '#90bab9' }}>
                <Resource accountStore={accountStore} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={3} style={{ background: '#00a9a9' }}>
                <OrderList
                  token={token}
                  tradeStore={tradeStore}
                  buyOrdersList={tradeStore.buyOrdersList}
                  sellOrdersList={tradeStore.sellOrdersList}
                />
              </Col>
              <Col xs={12} md={9}>
                <Row>
                  <Col xs={12} md={8} style={{ background: '#a9aaa9' }}>
                    {/* <TradingChart /> */}
                  </Col>
                  <Col xs={12} md={4} style={{ background: '#a9a909' }}>
                    <Market marketStore={marketStore} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} style={{ background: '#aaff88' }}>
                    <Order
                      token={token}
                      accountStore={accountStore}
                      tradeStore={tradeStore}
                      eosioStore={eosioStore}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8}>
                <Row>
                  <Col xs={12} style={{ background: '#aaaaa9' }}>
                    {tradeStore.openOrdersList && (
                      <OpenOrder
                        tradeStore={tradeStore}
                        openOrdersList={tradeStore.openOrdersList}
                        accountStore={accountStore}
                      />
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} style={{ background: '#00a9a9' }}>
                    <OrderHistory
                      accountStore={accountStore}
                      tradeStore={tradeStore}
                      ordersHistoryList={tradeStore.ordersHistoryList}
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={4} style={{ background: '#90bab9' }}>
                <Wallet
                  accountStore={accountStore}
                  marketStore={marketStore}
                  eosioStore={eosioStore}
                />
              </Col>
            </Row>
          </Grid>
        ) : (
          ''
        )}
      </Fragment>
    )
  }
}

export default compose(
  inject('marketStore', 'eosioStore', 'tradeStore', 'accountStore'),
  observer
)(TradePage)
