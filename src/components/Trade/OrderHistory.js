import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import classnames from 'classnames'
import Select from 'react-select'
import { ProgressBar } from 'react-bootstrap'
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap'
import {
  ORDER_TYPE_BUY,
  ORDER_STATUS_ALL_DEALED,
  ORDER_STATUS_CANCELLED,
  ORDER_DETAIL_DEAL_STATUS_CANCELLED,
  ORDER_DATE_FORMAT
} from '../../constants/Values'

import { format, subDays } from 'date-fns'
import { Text, ShadowedCard, InputPairContainer, Header6 } from '../Common/Common'
import { getTypeFilter, typeOptions, pageSizeOptions } from '../../utils/OrderSearchFilter'

class OrderHistory extends Component {
  constructor(props) {
    super(props)
    const today = new Date()

    this.toggle = this.toggle.bind(this)

    this.state = {
      activeTab: '1',
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
        if (changed.newValue === true) {
          this.getOrderHistory()
        } else {
          tradeStore.clearOrdersHistory()
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

    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => {
                this.toggle('1')
              }}>
              Order History
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <div className="table-responsive bootgrid">
              <table id="bootgrid-basic" className="table table-hover">
                <thead>
                  <tr>
                    <th data-type="date">
                      <FormattedMessage id="Date" />
                    </th>
                    <th>
                      <FormattedMessage id="Pair" />
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
                {accountStore.isLogin &&
                  ordersHistoryList &&
                  ordersHistoryCount > 0 && (
                    <tbody>
                      {ordersHistoryList.slice(startIndex, endIndex).map(o => {
                        return (
                          <tr key={o.id}>
                            <td>
                              <Header6>{format(o.updated, ORDER_DATE_FORMAT)}</Header6>
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
                                                od.deal_status ===
                                                ORDER_DETAIL_DEAL_STATUS_CANCELLED
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
                    <div style={{ textAlign: 'center' }}>
                      <FormattedMessage id="No Data" />
                    </div>
                  )
                )
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <FormattedMessage id="Please Login" />
                </div>
              )}
            </div>

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
                style={{ justifyContent: 'center', alignItems: 'center' }}>
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
          </TabPane>
        </TabContent>
      </div>
    )
  }
}

export default OrderHistory
