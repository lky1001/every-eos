import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

class OrderList extends Component {
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
