import React, { Component, Fragment } from 'react'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Text, OrderListTable, TokenPrice, PriceIcon, PriceRow, PriceBack } from '../Common/Common'

import {
  ORDER_PAGE_LIMIT,
  GET_ORDER_LIST_INTERVAL,
  ORDER_STATUS_NOT_DEAL,
  ORDER_STATUS_PARTIAL_DEALED
} from '../../constants/Values'
import { isNumber } from 'util'

class OrderList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ordersIntervalId: 0
    }
  }

  componentDidMount = () => {
    const { tradeStore, token } = this.props

    tradeStore.getBuyOrders(token.id, ORDER_PAGE_LIMIT)
    tradeStore.getSellOrders(token.id, ORDER_PAGE_LIMIT)

    const ordersIntervalId = setInterval(async () => {
      await tradeStore.getBuyOrders(token.id, ORDER_PAGE_LIMIT)
      await tradeStore.getSellOrders(token.id, ORDER_PAGE_LIMIT)
    }, GET_ORDER_LIST_INTERVAL)

    this.setState({
      ordersIntervalId: ordersIntervalId
    })
  }

  componentWillUnmount = () => {
    if (this.state.ordersIntervalId > 0) {
      clearInterval(this.state.ordersIntervalId)
    }
  }

  onOrderListClick = price => {
    const { tradeStore } = this.props
    tradeStore.setPrice(price)
  }

  render() {
    const { token, buyOrdersList, sellOrdersList } = this.props
    const sellMax =
      sellOrdersList.length > 0
        ? sellOrdersList.reduce((a, b) => {
          return Math.max(isNumber(a) ? a : a.stacked_amount, b.stacked_amount)
        })
        : 0.0

    const buyMax =
      buyOrdersList.length > 0
        ? buyOrdersList.reduce((a, b) => {
          return Math.max(isNumber(a) ? a : a.stacked_amount, b.stacked_amount)
        })
        : 0.0

    return (
      <Fragment>
        <OrderListTable className="table order-list-table">
          <thead>
            <tr>
              <th style={{ width: '30%' }}>
                <FormattedMessage id="Price(EOS)" />
              </th>
              <th style={{ width: '40%' }}>
                <FormattedMessage id="Amount" />
                {`(${token.symbol})`}
              </th>
              <th style={{ width: '35%' }}>
                <FormattedMessage id="Total(EOS)" />
              </th>
            </tr>
          </thead>
        </OrderListTable>
        <div className="table-responsive">
          <Table className="order-list-table">
            <tbody>
              {sellOrdersList &&
                sellOrdersList.map((o, i) => {
                  const width = (o.stacked_amount / sellMax) * 100

                  return (
                    <tr key={i} onClick={this.onOrderListClick.bind(this, o.token_price)}>
                      <td style={{ width: '30%' }}>
                        <a href="#">
                          <PriceRow>{o.token_price.toFixed(4)}</PriceRow>
                        </a>
                      </td>
                      <td style={{ width: '40%' }}>
                        <a href="#">
                          <PriceBack
                            up
                            style={{
                              width: width + '%'
                            }}
                          >
                            -
                          </PriceBack>
                          <PriceRow
                            style={{
                              position: 'absolute',
                              right: '18px'
                            }}
                          >
                            {o.stacked_amount.toFixed(4)}
                          </PriceRow>
                        </a>
                      </td>
                      <td style={{ width: '35%' }}>
                        <a href="#">
                          <PriceRow>
                            {Math.abs(
                              o.token_price.toFixed(token.precision) *
                                o.stacked_amount.toFixed(token.precision)
                            ).toFixed(token.precision)}
                          </PriceRow>
                        </a>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </Table>
        </div>

        <TokenPrice className="table-responsive">
          <Text color={token.last_price - token.last_previous_price > 0 ? 'Red' : 'Blue'}>{`${
            token.last_price
          }`}</Text>{' '}
          <PriceIcon
            className="ion-arrow-up-c"
            color={token.last_price - token.last_previous_price > 0 ? 'Red' : 'Blue'}
          />
        </TokenPrice>

        <div className="table-responsive">
          <OrderListTable className="table order-list-table">
            <tbody>
              {buyOrdersList &&
                buyOrdersList.map((o, i) => {
                  const width = (o.stacked_amount / buyMax) * 100

                  return (
                    <tr key={i} onClick={this.onOrderListClick.bind(this, o.token_price)}>
                      <td style={{ width: '30%' }}>
                        <a href="#">
                          <PriceRow>{o.token_price.toFixed(4)}</PriceRow>
                        </a>
                      </td>
                      <td style={{ width: '40%' }}>
                        <a href="#">
                          <PriceBack
                            down
                            style={{
                              width: width + '%'
                            }}
                          >
                            -
                          </PriceBack>
                          <PriceRow
                            style={{
                              position: 'absolute',
                              right: '18px'
                            }}
                          >
                            {o.stacked_amount.toFixed(4)}
                          </PriceRow>
                        </a>
                      </td>
                      <td style={{ width: '35%' }}>
                        <a href="#">
                          <PriceRow>
                            {Math.abs(
                              o.token_price.toFixed(token.precision) *
                                o.stacked_amount.toFixed(token.precision)
                            ).toFixed(token.precision)}
                          </PriceRow>
                        </a>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </OrderListTable>
        </div>
      </Fragment>
    )
  }
}

export default OrderList
