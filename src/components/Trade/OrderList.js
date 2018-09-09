import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { ORDER_PAGE_LIMIT } from '../../constants/Values'

class OrderList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      getOrderListIntervalId: 0
    }
  }

  componentDidMount = () => {
    const { accountStore, tradeStore } = this.props

    if (accountStore.isLogin) {
      const getOrderListIntervalId = setInterval(this.getOrderList, 5000)

      this.setState({
        getOrderListIntervalId: getOrderListIntervalId
      })
    }

    this.disposer = accountStore.subscribeLoginState(changed => {
      console.log(JSON.stringify(changed))

      if (changed.oldValue !== changed.newValue) {
        if (changed.newValue) {
          const getOrderListIntervalId = setInterval(this.getOrderList, 5000)

          this.setState({
            getOrderListIntervalId: getOrderListIntervalId
          })
        } else {
          clearInterval(this.state.getOrderListIntervalId)
        }
      }
    })

    const ordersIntervalId = setInterval(async () => {
      await tradeStore.getBuyOrders(1, ORDER_PAGE_LIMIT)
      await tradeStore.getSellOrders(1, ORDER_PAGE_LIMIT)
    }, 2000)

    this.setState({
      ordersIntervalId: ordersIntervalId
    })
  }

  componentWillUnmount = () => {
    if (this.state.ordersIntervalId > 0) {
      clearInterval(this.state.ordersIntervalId)
    }

    if (this.state.getOrderListIntervalId > 0) {
      clearInterval(this.state.getOrderListIntervalId)
    }

    this.disposer()
  }

  getOrderList = async () => {
    // todo - get order list
    console.log('get order list')
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
                buyOrdersList.map(o => {
                  return (
                    <tr key={o.id} onClick={this.onOrderListClick.bind(this, o.token_price)}>
                      <td>{o.token_price}</td>
                      <td>{o.total_amount}</td>
                      <td>
                        {Math.abs(
                          o.token_price.toFixed(token.precision) *
                            o.total_amount.toFixed(token.precision)
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
                sellOrdersList.map(o => {
                  return (
                    <tr key={o.id} onClick={this.onOrderListClick.bind(this, o.token_price)}>
                      <td>{o.token_price}</td>
                      <td>{o.total_amount}</td>
                      <td>
                        {Math.abs(
                          o.token_price.toFixed(token.precision) *
                            o.total_amount.toFixed(token.precision)
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

export default compose(
  inject('tradeStore', 'accountStore'),
  observer
)(OrderList)
