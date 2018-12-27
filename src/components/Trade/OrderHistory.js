import React, { PureComponent } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { FormattedMessage } from 'react-intl'
import { Table } from 'react-bootstrap'
import { Scrollbars } from 'react-custom-scrollbars'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'
import {
  ORDER_TYPE_BUY,
  ORDER_STATUS_ALL_DEALED,
  ORDER_STATUS_CANCELLED,
  ORDER_DETAIL_DEAL_STATUS_CANCELLED,
  ORDER_DATE_FORMAT
} from '../../constants/Values'

import { format } from 'date-fns'
import Loader from 'react-loader-spinner'
import {
  HeaderTable,
  TableLgRow,
  OrderBaseColumn,
  DateColumn,
  BuyTypeColumn,
  SellTypeColumn
} from '../Common/Common'

class OrderHistory extends PureComponent {
  componentDidMount = () => {
    const { accountStore, tradeStore } = this.props

    if (accountStore.isLogin) {
      tradeStore.initExchangeOrdersHistoryFilter()
      tradeStore.getOrdersHistory(accountStore.loginAccountInfo.account_name)
    } else {
      this.disposer = accountStore.subscribeLoginState(changed => {
        if (changed.oldValue !== changed.newValue) {
          if (changed.newValue) {
            tradeStore.initExchangeOrdersHistoryFilter()
            tradeStore.getOrdersHistory(accountStore.loginAccountInfo.account_name)
          } else {
            tradeStore.clearOrdersHistory()
          }
        }
      })
    }
  }

  componentWillUnmount = () => {
    if (this.disposer) this.disposer()
  }

  pageClicked = idx => {
    const { tradeStore, accountStore, ordersHistoryTotalCount, ordersHistoryPageSize } = this.props

    const pageCount =
      ordersHistoryTotalCount > 0
        ? Math.ceil(ordersHistoryTotalCount / ordersHistoryPageSize.value)
        : 1

    if (idx > 0 && idx <= pageCount) {
      tradeStore.setOrdersHistoryPage(idx)
      tradeStore.getOrdersHistory(accountStore.loginAccountInfo.account_name)
    }
  }

  render() {
    const {
      accountStore,
      ordersHistoryList,
      ordersHistoryCount,
      ordersHistoryTotalCount,
      ordersHistoryLoading,
      ordersHistoryError,
      ordersHistoryPage,
      ordersHistoryPageSize
    } = this.props

    const pageCount =
      ordersHistoryTotalCount > 0
        ? Math.ceil(ordersHistoryTotalCount / ordersHistoryPageSize.value)
        : 1
    const openHistoryContentHeight = `${40 * ordersHistoryCount}px`

    return (
      <Tabs>
        <TabList>
          <Tab>
            <FormattedMessage id="Order History" />
          </Tab>
        </TabList>

        <TabPanel>
          <HeaderTable className="table order-list-table">
            <thead>
              <tr>
                <th data-type="date" style={{ width: '15%', textAlign: 'center' }}>
                  <FormattedMessage id="Date" />
                </th>
                <th style={{ width: '10%', textAlign: 'right' }}>
                  <FormattedMessage id="Pair" />
                </th>
                <th style={{ width: '5%', textAlign: 'right' }}>
                  <FormattedMessage id="Type" />
                </th>
                <th style={{ width: '10%', textAlign: 'right' }}>
                  <FormattedMessage id="Price" />
                </th>
                <th style={{ width: '10%', textAlign: 'right' }}>
                  <FormattedMessage id="Average" />
                </th>
                <th style={{ width: '10%', textAlign: 'right' }}>
                  <FormattedMessage id="Amount" />
                </th>
                <th style={{ width: '10%', textAlign: 'right' }}>
                  <FormattedMessage id="Dealed" />
                </th>
                <th style={{ width: '10%', textAlign: 'right' }}>
                  <FormattedMessage id="Total" />
                </th>
                <th style={{ width: '10%', textAlign: 'right' }}>
                  <FormattedMessage id="Status" />
                </th>
                <th style={{ width: '10%', textAlign: 'right' }}>
                  <FormattedMessage id="Detail" />
                </th>
              </tr>
            </thead>
          </HeaderTable>

          <Scrollbars
            style={{
              height: openHistoryContentHeight,
              maxHeight: `${40 * ordersHistoryPageSize.value}px`
            }}>
            <Table className="order-list-table responsive hover">
              {accountStore.isLogin && ordersHistoryList && ordersHistoryCount > 0 && (
                <tbody>
                  {ordersHistoryList.map(o => {
                    return (
                      <TableLgRow key={o.id}>
                        <DateColumn>{format(o.updated, ORDER_DATE_FORMAT)}</DateColumn>
                        <OrderBaseColumn>
                          {o.token.symbol} / {o.token.market}
                        </OrderBaseColumn>
                        {o.type === ORDER_TYPE_BUY ? (
                          <BuyTypeColumn>
                            <FormattedMessage id={o.type} />
                          </BuyTypeColumn>
                        ) : (
                          <SellTypeColumn>
                            <FormattedMessage id={o.type} />
                          </SellTypeColumn>
                        )}
                        <OrderBaseColumn>{o.token_price.toFixed(4)} EOS</OrderBaseColumn>
                        <OrderBaseColumn>
                          {o.status === ORDER_STATUS_ALL_DEALED
                            ? o.orderDetails.length === 0
                              ? 0
                              : (
                                  o.orderDetails.reduce(
                                    (acc, curr) => acc + curr.amount * curr.token_price,
                                    0
                                  ) / o.orderDetails.reduce((acc, curr) => acc + curr.amount, 0)
                                ).toFixed(4) + ' EOS'
                            : o.status === ORDER_STATUS_CANCELLED
                            ? o.orderDetails.length === 0
                              ? 0
                              : (
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
                                ).toFixed(4) + ' EOS'
                            : '-'}
                        </OrderBaseColumn>
                        <OrderBaseColumn>{o.total_amount}</OrderBaseColumn>
                        <OrderBaseColumn>{o.deal_amount}</OrderBaseColumn>
                        <OrderBaseColumn>
                          {o.status === ORDER_STATUS_ALL_DEALED
                            ? o.orderDetails.length === 0
                              ? 0
                              : Math.round(
                                  o.orderDetails.reduce(
                                    (acc, curr) => acc + curr.amount * curr.token_price,
                                    0
                                  )
                                ).toFixed(4) + ' EOS'
                            : o.status === ORDER_STATUS_CANCELLED
                            ? o.orderDetails.length === 0
                              ? 0
                              : Math.round(
                                  o.orderDetails
                                    .filter(
                                      od => od.deal_status === ORDER_DETAIL_DEAL_STATUS_CANCELLED
                                    )
                                    .reduce((acc, curr) => acc + curr.amount * curr.token_price, 0)
                                ).toFixed(4) + ' EOS'
                            : '-'}
                        </OrderBaseColumn>
                        <OrderBaseColumn>
                          <FormattedMessage id={o.status} />
                        </OrderBaseColumn>
                        <OrderBaseColumn>
                          <FormattedMessage id="Detail" />
                        </OrderBaseColumn>
                      </TableLgRow>
                    )
                  })}
                </tbody>
              )}
            </Table>
          </Scrollbars>
          {accountStore.isLogin ? (
            ordersHistoryLoading ? (
              <div
                style={{
                  width: '40px',
                  margin: 'auto',
                  paddingTop: '20px',
                  paddingBottom: '0px'
                }}>
                <Loader type="ThreeDots" color="#448AFF" height={40} width={40} />
              </div>
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

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Pagination
              aria-label="orders pagination"
              style={{ justifyContent: 'center', alignItems: 'center' }}>
              <PaginationItem>
                <PaginationLink previous onClick={() => this.pageClicked(ordersHistoryPage - 1)} />
              </PaginationItem>
              {Array(pageCount)
                .fill(null)
                .map((v, idx) => (
                  <PaginationItem key={idx} active={ordersHistoryPage === idx + 1}>
                    <PaginationLink onClick={() => this.pageClicked(idx + 1)}>
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              <PaginationItem>
                <PaginationLink next onClick={() => this.pageClicked(ordersHistoryPage + 1)} />
              </PaginationItem>
            </Pagination>
          </div>
        </TabPanel>
      </Tabs>
    )
  }
}

export default OrderHistory
