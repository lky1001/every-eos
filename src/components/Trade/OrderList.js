import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import {
  ORDER_PAGE_LIMIT,
  GET_ORDER_LIST_INTERVAL,
  ORDER_STATUS_NOT_DEAL,
  ORDER_STATUS_PARTIAL_DEALED
} from '../../constants/Values'

class OrderList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ordersIntervalId: 0
    }
  }

  componentDidMount = () => {
    const { tradeStore, token } = this.props

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
    const { token, tradeStore } = this.props
    const { buyOrdersList, sellOrdersList } = tradeStore

    return (
      <Fragment>
        <div className="d-flex flex-column">
          <Table>
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="Price(EOS)" />
                </th>
                <th>
                  <FormattedMessage id="Amount" />
                  {`(${token.symbol})`}
                </th>
                <th>
                  <FormattedMessage id="Total(EOS)" />
                </th>
              </tr>
            </thead>
            <tbody>
              {buyOrdersList &&
                buyOrdersList.map((o, i) => {
                  return (
                    <tr key={i} onClick={this.onOrderListClick.bind(this, o.token_price)}>
                      <td>{o.token_price}</td>
                      <td>{o.stacked_amount}</td>
                      <td>
                        {Math.abs(
                          o.token_price.toFixed(token.precision) *
                            o.stacked_amount.toFixed(token.precision)
                        ).toFixed(token.precision)}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </Table>
        </div>

        <div className="d-flex flex-column-reverse">
          <Table>
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="Price(EOS)" />
                </th>
                <th>
                  <FormattedMessage id="Amount" />
                  {`(${token.symbol})`}
                </th>
                <th>
                  <FormattedMessage id="Total(EOS)" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sellOrdersList &&
                sellOrdersList.map((o, i) => {
                  return (
                    <tr key={i} onClick={this.onOrderListClick.bind(this, o.token_price)}>
                      <td>{o.token_price}</td>
                      <td>{o.stacked_amount}</td>
                      <td>
                        {Math.abs(
                          o.token_price.toFixed(token.precision) *
                            o.stacked_amount.toFixed(token.precision)
                        ).toFixed(token.precision)}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </Table>
        </div>
      </Fragment>
    )
  }
}

export default OrderList
