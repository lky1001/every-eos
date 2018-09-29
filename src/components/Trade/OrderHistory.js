import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { FormattedMessage } from 'react-intl'
import classnames from 'classnames'
import Select from 'react-select'
import { ProgressBar, Table } from 'react-bootstrap'
import { Scrollbars } from 'react-custom-scrollbars'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'
import {
  ORDER_TYPE_BUY,
  ORDER_STATUS_ALL_DEALED,
  ORDER_STATUS_CANCELLED,
  ORDER_DETAIL_DEAL_STATUS_CANCELLED,
  ORDER_DATE_FORMAT
} from '../../constants/Values'

import { format, subDays } from 'date-fns'
import {
  HeaderTable,
  InputPairContainer,
  Header6,
  TableLgRow,
  OrderBaseColumn,
  DateColumn,
  BuyTypeColumn,
  SellTypeColumn
} from '../Common/Common'
import { getTypeFilter, typeOptions, pageSizeOptions } from '../../utils/OrderSearchFilter'
import ColorsConstant from '../Colors/ColorsConstant'
import styled from 'styled-components'

class OrderHistory extends Component {
  constructor(props) {
    super(props)
    const today = new Date()

    this.toggle = this.toggle.bind(this)

    this.state = {
      currentPage: 1,
      pageCount: 1,
      token_symbol: null,
      from: subDays(today, 30),
      to: today,
      selectedPageSize: pageSizeOptions[0],
      selectedType: typeOptions[0]
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { ordersHistoryCount } = nextProps

    const pageCount =
      ordersHistoryCount > 0 ? Math.ceil(ordersHistoryCount / prevState.selectedPageSize.value) : 1

    return {
      ...prevState,
      pageCount: pageCount
    }
  }

  componentDidMount = () => {
    const { accountStore, tradeStore } = this.props

    if (accountStore.isLogin) {
      this.getOrderHistory()
    } else {
      this.disposer = accountStore.subscribeLoginState(changed => {
        if (changed.oldValue !== changed.newValue) {
          if (changed.newValue) {
            this.getOrderHistory()
          } else {
            tradeStore.clearOrdersHistory()
          }
        }
      })
    }
  }

  getOrderHistory = async () => {
    const { tradeStore, accountStore } = this.props
    const { from, to, selectedType } = this.state

    await tradeStore.getOrdersHistory(
      accountStore.loginAccountInfo.account_name,
      '',
      getTypeFilter(selectedType),
      JSON.stringify([ORDER_STATUS_ALL_DEALED, ORDER_STATUS_CANCELLED]),
      0,
      0,
      from,
      to
    )
  }

  componentWillUnmount = () => {
    if (this.disposer) this.disposer()
  }

  handlePageSizeChange = selectedPageSize => {
    this.setState({ selectedPageSize })
  }

  pageClicked = idx => {
    const { pageCount } = this.state

    if (idx > 0 && idx <= pageCount) {
      this.setState({
        currentPage: idx
      })
    }
  }

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  render() {
    const {
      accountStore,
      ordersHistoryList,
      ordersHistoryCount,
      ordersHistoryLoading,
      ordersHistoryError
    } = this.props
    const { selectedPageSize, pageCount, currentPage } = this.state
    const startIndex = (currentPage - 1) * selectedPageSize.value
    const endIndex = startIndex + selectedPageSize.value
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
                <th style={{ width: '10%', textAlign: 'right' }}>Detail</th>
              </tr>
            </thead>
          </HeaderTable>

          <Scrollbars
            style={{
              height: openHistoryContentHeight,
              maxHeight: `${40 * selectedPageSize.value}px`
            }}
          >
            <Table className="order-list-table responsive hover">
              {accountStore.isLogin &&
                ordersHistoryList &&
                ordersHistoryCount > 0 && (
                  <tbody>
                    {ordersHistoryList.slice(startIndex, endIndex).map(o => {
                      return (
                        <TableLgRow key={o.id}>
                          <DateColumn>{format(o.updated, ORDER_DATE_FORMAT)}</DateColumn>
                          <OrderBaseColumn>
                            {o.token.symbol} / {o.token.market}
                          </OrderBaseColumn>
                          {o.type === ORDER_TYPE_BUY ? (
                            <BuyTypeColumn>{o.type}</BuyTypeColumn>
                          ) : (
                            <SellTypeColumn>{o.type}</SellTypeColumn>
                          )}
                          <OrderBaseColumn>{o.token_price.toFixed(4)}</OrderBaseColumn>
                          <OrderBaseColumn>
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
                                        od =>
                                          od.deal_status === ORDER_DETAIL_DEAL_STATUS_CANCELLED
                                      )
                                      .reduce(
                                        (acc, curr) => acc + curr.amount * curr.token_price,
                                        0
                                      ) /
                                        o.orderDetails
                                          .filter(
                                            od =>
                                              od.deal_status === ORDER_DETAIL_DEAL_STATUS_CANCELLED
                                          )
                                          .reduce((acc, curr) => acc + curr.amount, 0)
                                  )
                                : '-'}
                          </OrderBaseColumn>
                          <OrderBaseColumn>{o.total_amount}</OrderBaseColumn>
                          <OrderBaseColumn>{o.deal_amount}</OrderBaseColumn>
                          <OrderBaseColumn>-</OrderBaseColumn>
                          <OrderBaseColumn>
                            <FormattedMessage id={o.status} />
                          </OrderBaseColumn>
                          <OrderBaseColumn>Detail</OrderBaseColumn>
                        </TableLgRow>
                      )
                    })}
                  </tbody>
                )}
            </Table>
          </Scrollbars>
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
                  }}
                >
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
              }}
            >
              <FormattedMessage id="Please Login" />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <InputPairContainer>
              <Header6 className="p-1">Total {ordersHistoryCount}</Header6>
              <div className="p-5" style={{ width: '160px' }}>
                <Select
                  value={selectedPageSize}
                  onChange={this.handlePageSizeChange}
                  options={pageSizeOptions}
                />
              </div>
            </InputPairContainer>
            <Pagination
              aria-label="orders pagination"
              style={{ justifyContent: 'center', alignItems: 'center' }}
            >
              <PaginationItem>
                <PaginationLink previous onClick={() => this.pageClicked(currentPage - 1)} />
              </PaginationItem>
              {Array(pageCount)
                .fill(null)
                .map((v, idx) => (
                  <PaginationItem key={idx} active={currentPage === idx + 1}>
                    <PaginationLink onClick={() => this.pageClicked(idx + 1)}>
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              <PaginationItem>
                <PaginationLink next onClick={() => this.pageClicked(currentPage + 1)} />
              </PaginationItem>
            </Pagination>
          </div>
        </TabPanel>
      </Tabs>
    )
  }
}

export default OrderHistory
