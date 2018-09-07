import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Grid, Row, Col, Table } from 'react-bootstrap'
import { Card, Button, CardHeader, CardFooter, CardBody, CardTitle, CardText } from 'reactstrap'
import { FormattedMessage } from 'react-intl'

class OrderList extends Component {
  render() {
    const { token, orderList } = this.props

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
              {orderList.filter(o => o.type === 'BUY').map(o => {
                return (
                  <tr key={o.id}>
                    <td>{o.token_price}</td>
                    <td>{o.amount}</td>
                    <td>{Math.abs(o.token_price.toFixed(token.precision) * o.amount.toFixed(token.precision)).toFixed(token.precision)}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>

        <div classname="d-flex flex-column-reverse">
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
              {orderList.filter(o => o.type === 'SELL').map(o => {
                return (
                  <tr key={o.id}>
                    <td>{o.token_price}</td>
                    <td>{o.amount}</td>
                    <td>{Math.abs(o.token_price.toFixed(token.precision) * o.amount.toFixed(token.precision)).toFixed(token.precision)}</td>
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
  inject('tradeStore'),
  observer
)(OrderList)
