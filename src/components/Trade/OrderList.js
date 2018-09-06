import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Grid, Row, Col, Table } from 'react-bootstrap'
import { Card, Button, CardHeader, CardFooter, CardBody, CardTitle, CardText } from 'reactstrap'

class OrderList extends Component {
  render() {
    const { tokenSymbol, orderList } = this.props

    return (
      <Fragment>
        <div className="d-flex flex-column">
          <Table>
            <thead>
              <tr>
                <th>Price(EOS)</th>
                <th>{`Amount ${tokenSymbol}`}</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {orderList.filter(o => o.type === 'BUY').map(o => {
                return (
                  <tr key={o.id}>
                    <td>{o.token_price}</td>
                    <td>{o.amount}</td>
                    <td>{Math.abs(o.token_price * o.amount).toFixed(4)}</td>
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
                <th>Price(EOS)</th>
                <th>{`Amount ${tokenSymbol}`}</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {orderList.filter(o => o.type === 'SELL').map(o => {
                return (
                  <tr key={o.id}>
                    <td>{o.token_price}</td>
                    <td>{o.amount}</td>
                    <td>{Math.abs(o.token_price * o.amount).toFixed(4)}</td>
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
