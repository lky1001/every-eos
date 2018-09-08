import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

class OrderHistory extends Component {
  render() {
    const { token, orderHistory } = this.props

    //Todo
    return (
      <Fragment>
        <div>
          <Table>
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="Date" />
                </th>
                <th>
                  <FormattedMessage id="Pair" />
                  {`(${token.symbol})`}
                </th>
                <th>
                  <FormattedMessage id="Type" />
                </th>
                <th>
                  <FormattedMessage id="Price" />
                </th>
                <th>
                  <FormattedMessage id="Average" />
                </th>
                <th>
                  <FormattedMessage id="Amount" />
                </th>
                <th>
                  <FormattedMessage id="Dealed" />
                </th>
                <th>
                  <FormattedMessage id="Total" />
                </th>
                <th>
                  <FormattedMessage id="Status" />
                </th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map(o => {
                return (
                  <tr key={o.id}>
                    <td>{o.created}</td>
                    <td>{o.market}</td>
                    <td>{o.type}</td>
                    <td>{o.token_price}</td>
                    <td>{o.price}</td>
                    <td>{o.total_amount}</td>
                    {Math.abs(
                      o.token_price.toFixed(token.precision) *
                        o.total_amount.toFixed(token.precision)
                    ).toFixed(token.precision)}
                    <td>{o.status}</td>
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

export default OrderHistory
