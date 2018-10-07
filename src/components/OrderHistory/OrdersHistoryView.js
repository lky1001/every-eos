import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { format } from 'date-fns'
import {
  ORDER_STATUS_ALL_DEALED,
  ORDER_STATUS_CANCELLED,
  ORDER_DETAIL_DEAL_STATUS_CANCELLED,
  ORDER_TYPE_BUY,
  ORDER_DATE_FORMAT
} from '../../constants/Values'
import { ProgressBar } from 'react-bootstrap'
import { Header6 } from '../Common/Common'

class OrdersHistoryView extends Component {
  render() {
    const { accountStore, ordersHistoryList, ordersHistoryCount, ordersHistoryLoading } = this.props

    return (
      <div className="table-responsive bootgrid">
        <table id="bootgrid-basic" className="table table-hover">
          <thead>
            <tr>
              <th data-column-id="date" data-type="date">
                <FormattedMessage id="Date" />
              </th>
              <th data-column-id="pair">
                <FormattedMessage id="Pair" />
              </th>
              <th data-column-id="type">
                <FormattedMessage id="Type" />
              </th>
              <th data-column-id="price">
                <FormattedMessage id="Price" />
              </th>
              <th data-column-id="avg">
                <FormattedMessage id="Average" />
              </th>
              <th data-column-id="amount">
                <FormattedMessage id="Amount" />
              </th>
              <th data-column-id="dealed">
                <FormattedMessage id="Dealed" />
              </th>
              <th data-column-id="total">
                <FormattedMessage id="Total" />
              </th>
              <th data-column-id="status">
                <FormattedMessage id="Status" />
              </th>
            </tr>
          </thead>
          {accountStore.isLogin &&
            ordersHistoryList &&
            ordersHistoryCount > 0 && (
              <tbody>
                {ordersHistoryList.map(o => {
                  return (
                    <tr key={o.id}>
                      <td>
                        <Header6>{format(o.created, ORDER_DATE_FORMAT)}</Header6>
                      </td>
                      <td>
                        <Header6 color={'Blue'}>
                          {o.token.symbol} / {o.token.market}
                        </Header6>
                      </td>
                      <td>
                        <Header6 color={o.type === ORDER_TYPE_BUY ? 'Green' : 'Red'}>
                          {o.type}
                        </Header6>
                      </td>
                      <td>{o.token_price}</td>
                      <td>
                        {o.status === ORDER_STATUS_ALL_DEALED
                          ? o.orderDetails.length === 0
                            ? 0
                            : Math.round(
                              o.orderDetails.reduce(
                                (acc, curr) => acc + curr.amount * curr.token_price,
                                0
                              ) / o.orderDetails.reduce((acc, curr) => acc + curr.amount, 0)
                            )
                          : o.status === ORDER_STATUS_CANCELLED
                            ? o.orderDetails.length === 0
                              ? 0
                              : Math.round(
                                o.orderDetails
                                  .filter(
                                    od => od.deal_status === ORDER_DETAIL_DEAL_STATUS_CANCELLED
                                  )
                                  .reduce(
                                    (acc, curr) => acc + curr.amount * curr.token_price,
                                    0
                                  ) /
                                    o.orderDetails
                                      .filter(
                                        od => od.deal_status === ORDER_DETAIL_DEAL_STATUS_CANCELLED
                                      )
                                      .reduce((acc, curr) => acc + curr.amount, 0)
                              )
                            : '-'}
                      </td>
                      <td>
                        <Header6>{o.total_amount}</Header6>
                      </td>
                      <td>
                        <Header6>{o.deal_amount}</Header6>
                      </td>
                      <td>
                        <Header6>-</Header6>
                      </td>
                      <td>
                        <Header6>{o.status}</Header6>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            )}
        </table>

        {accountStore.isLogin ? (
          ordersHistoryLoading ? (
            <ProgressBar striped bsStyle="success" now={40} />
          ) : (
            (!ordersHistoryList || ordersHistoryCount === 0) && (
              <div
                style={{
                  textAlign: 'center',
                  height: '70px',
                  fontSize: '16px',
                  paddingTop: '25px'
                }}>
                <FormattedMessage id="No Data" />
              </div>
            )
          )
        ) : (
          <div
            style={{
              textAlign: 'center',
              height: '70px',
              fontSize: '16px',
              paddingTop: '25px'
            }}>
            <FormattedMessage id="Please Login" />
          </div>
        )}
      </div>
    )
  }
}

export default OrdersHistoryView
