import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

import { Grid, Row, Col } from 'react-bootstrap'
import { ProgressBar } from 'react-bootstrap'
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
      token: token,
      intervalId: 0
    }
  }

  componentWillMount = async () => {
    const { marketStore, tradeStore } = this.props

    tradeStore.setTokenSymbol(this.state.token)

    await marketStore.getTokensBySymbol(this.state.token)
  }

  componentDidMount = async () => {
    const { tradeStore } = this.props

    const id = setInterval(async () => {
      await tradeStore.getOrdersByTokenId(1)
    }, 2000)

    this.setState({
      intervalId: id
    })
  }

  componentWillUnmount = () => {
    if (this.state.intervalId > 0) {
      clearInterval(this.state.intervalId)
    }
  }

  render() {
    const { accountStore, marketStore, tradeStore, eosioStore } = this.props
    const token = marketStore.token.data.token
    const { orderList } = tradeStore

    return (
      <Fragment>
        {token ? (
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
                {!orderList ? (
                  <ProgressBar striped bsStyle="success" now={40} />
                ) : (
                  <OrderList tradeStore={tradeStore} orderList={orderList} token={token} />
                )}
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
                    <Order token={token} accountStore={accountStore} tradeStore={tradeStore} eosioStore={eosioStore} />
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
)(Trade)
