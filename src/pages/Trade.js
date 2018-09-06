import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

import { Grid, Row, Col } from 'react-bootstrap'

import TokenInfo from '../components/Trade/TokenInfo'
import Resource from '../components/Trade/Resource'
import OrderList from '../components/Trade/OrderList'
import Order from '../components/Trade/Order'
import Chart from '../components/Trade/Chart'
import Market from '../components/Trade/Market'

class Trade extends Component {
  constructor(props) {
    super(props)
    const { token } = this.props.match.params

    this.state = {
      token: token
    }
  }

  render() {
    const { accountStore, marketStore, tradeStore, eosioStore } = this.props
    const token = marketStore.token.data.token

    return (
      <Grid>
        <Row>
          <Col xs={12} md={8} style={{ background: '#a9a9a9' }}>
            <TokenInfo marketStore={marketStore} token={this.state.token} />
          </Col>
          <Col xs={12} md={4} style={{ background: '#90bab9' }}>
            <Resource />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={3} style={{ background: '#00a9a9' }}>
            <OrderList tradeStore={tradeStore} />
          </Col>
          <Col xs={12} md={9}>
            <Row>
              <Col xs={12} md={8} style={{ background: '#a9aaa9' }}>
                <Chart tradeStore={tradeStore} />
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
                In Order
              </Col>
            </Row>
            <Row>
              <Col xs={12} style={{ background: '#00a9a9' }}>
                Order History
              </Col>
            </Row>
          </Col>
          <Col xs={12} md={4} style={{ background: '#90bab9' }}>
            Wallet
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default compose(
  inject('marketStore', 'eosioStore', 'tradeStore', 'accountStore'),
  observer
)(Trade)
