import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

class OrderList extends Component {
  constructor(props) {
    super(props)
    this.disposer

    this.state = {
      intervalId: 0
    }
  }

  componentWillMount = () => {
    const { accountStore } = this.props

    if (accountStore.isLogin) {
      const intervalId = setInterval(this.getOrderList, 5000)

      this.setState({
        intervalId: intervalId
      })
    }

    this.disposer = accountStore.subscribeLoginState(changed => {
      console.log(JSON.stringify(changed))

      if (changed.oldValue !== changed.newValue) {
        if (changed.newValue) {
          const intervalId = setInterval(this.getOrderList, 5000)

          this.setState({
            intervalId: intervalId
          })
        } else {
          clearInterval(this.state.intervalId)
        }
      }
    })
  }

  componentWillUnmount = () => {
    if (this.state.intervalId > 0) {
      clearInterval(this.state.intervalId)
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
    const { token, buyOrdersList, sellOrdersList } = this.props

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
              {buyOrdersList.map(o => {
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
              {sellOrdersList.map(o => {
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

export default OrderList
