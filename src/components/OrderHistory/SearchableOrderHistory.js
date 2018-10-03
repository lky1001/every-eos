import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { FormattedMessage } from 'react-intl'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'
import Select from 'react-select'
import Helmet from 'react-helmet'
import { format, subDays } from 'date-fns'
import moment from 'moment'
import { formatDate, parseDate } from 'react-day-picker/moment'
import { ProgressBar } from 'react-bootstrap'
import {
  Container,
  Row,
  Col,
  Input,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap'

import {
  ORDER_STATUS_ALL_DEALED,
  ORDER_STATUS_CANCELLED,
  ORDER_DETAIL_DEAL_STATUS_CANCELLED,
  ORDER_TYPE_BUY,
  ORDER_DATE_FORMAT
} from '../../constants/Values'

import {
  getTypeFilter,
  getStatusFilter,
  typeOptions,
  statusOptions,
  pageSizeOptions
} from '../../utils/OrderSearchFilter'
import { ShadowedCard, InputPairContainer, Header6 } from '../Common/Common'

class SearchableOrderHistory extends Component {
  componentDidMount = () => {
    const { accountStore, tradeStore } = this.props

    if (accountStore.isLogin) {
      tradeStore.initOrdersHistoryFilter()
      tradeStore.getOrdersHistory(accountStore.loginAccountInfo.account_name)
    } else {
      this.disposer = accountStore.subscribeLoginState(changed => {
        if (changed.oldValue !== changed.newValue) {
          if (changed.newValue) {
            tradeStore.initOrdersHistoryFilter()
            tradeStore.getOrdersHistory(accountStore.loginAccountInfo.account_name)
          } else {
            tradeStore.clearOrdersHistory()
          }
        }
      })
    }
  }

  handleSearch = () => {
    const { tradeStore, accountStore } = this.props

    tradeStore.setOrdersHistoryPage(1)
    tradeStore.getOrdersHistory(accountStore.loginAccountInfo.account_name)
  }

  componentWillUnmount = () => {
    if (this.disposer) this.disposer()
  }

  handleTypeChange = selectedType => {
    const { tradeStore } = this.props
    tradeStore.setOrdersHistoryType(selectedType)
  }

  handleStatusChange = selectedStatus => {
    const { tradeStore } = this.props
    tradeStore.setOrdersHistoryStatus(selectedStatus)
  }

  handlePageSizeChange = async selectedPageSize => {
    const { accountStore, tradeStore } = this.props
    tradeStore.setOrdersHistoryPageSize(selectedPageSize)
    await tradeStore.getOrdersHistory(accountStore.loginAccountInfo.account_name)
  }

  showFromMonth = () => {
    const { ordersHistoryFrom, ordersHistoryTo } = this.props
    if (!ordersHistoryFrom) {
      return
    }
    if (moment(ordersHistoryTo).diff(moment(ordersHistoryFrom), 'months') < 2) {
      this.to.getDayPicker().showMonth(ordersHistoryFrom)
    }
  }

  handleTokenSymbolChange = symbol => {
    const { tradeStore } = this.props
    tradeStore.setTokenSymbolForSearch(symbol)
  }

  handleFromChange = from => {
    const { tradeStore } = this.props
    tradeStore.setOrdersHistoryFrom(from)
  }

  handleToChange = to => {
    const { tradeStore } = this.props
    tradeStore.setOrdersHistoryTo(to)
  }

  pageClicked = async idx => {
    const { accountStore, tradeStore, ordersHistoryTotalCount, ordersHistoryPageSize } = this.props

    const pageCount =
      ordersHistoryTotalCount > 0
        ? Math.ceil(ordersHistoryTotalCount / ordersHistoryPageSize.value)
        : 1

    if (idx > 0 && idx <= pageCount) {
      tradeStore.setOrdersHistoryPage(idx)
      await tradeStore.getOrdersHistory(accountStore.loginAccountInfo.account_name)
    }
  }

  render() {
    const {
      accountStore,
      ordersHistoryList,
      ordersHistoryCount,
      ordersHistoryLoading,
      ordersHistoryError,
      ordersHistoryFrom,
      ordersHistoryTo,
      ordersHistoryType,
      ordersHistoryStatus,
      ordersHistoryPageSize,
      ordersHistoryPage,
      ordersHistoryTotalCount
    } = this.props

    const pageCount =
      ordersHistoryTotalCount > 0
        ? Math.ceil(ordersHistoryTotalCount / ordersHistoryPageSize.value)
        : 1
    const modifiers = { start: ordersHistoryFrom, end: ordersHistoryTo }
    const startIndex = (ordersHistoryPage - 1) * ordersHistoryPageSize.value
    const endIndex = startIndex + ordersHistoryPageSize.value

    return (
      <Fragment>
        <section>
          <div className="container-fluid">
            <h5 className="mt0">Order History</h5>
            <ShadowedCard>
              <Row>
                <Col>
                  <InputPairContainer>
                    <Header6 className="p-1">Token</Header6>
                    <div className="p-5">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter Symbol"
                        onChange={s => this.handleTokenSymbolChange(s)}
                      />
                    </div>
                  </InputPairContainer>
                </Col>
                <Col>
                  <InputPairContainer>
                    <Header6 className="p-1">Type</Header6>
                    <div className="p-5" style={{ width: '100%' }}>
                      <Select
                        value={ordersHistoryType}
                        onChange={this.handleTypeChange}
                        options={typeOptions}
                      />
                    </div>
                  </InputPairContainer>
                </Col>

                <Col>
                  <InputPairContainer>
                    <Header6 className="p-1">Status</Header6>
                    <div className="p-5" style={{ width: '100%' }}>
                      <Select
                        value={ordersHistoryStatus}
                        onChange={this.handleStatusChange}
                        options={statusOptions}
                      />
                    </div>
                  </InputPairContainer>
                </Col>

                <Col>
                  <div className="InputFromTo p-5 h-100">
                    <DayPickerInput
                      style={{ height: '38px important!' }}
                      value={ordersHistoryFrom}
                      placeholder="From"
                      format="LL"
                      formatDate={formatDate}
                      parseDate={parseDate}
                      dayPickerProps={{
                        selectedDays: [ordersHistoryFrom, { ordersHistoryFrom, ordersHistoryTo }],
                        disabledDays: { after: ordersHistoryTo },
                        toMonth: ordersHistoryTo,
                        modifiers,
                        numberOfMonths: 2,
                        onDayClick: () => this.to.getInput().focus()
                      }}
                      onDayChange={this.handleFromChange}
                    />{' '}
                    —{' '}
                    <span className="InputFromTo-to">
                      <DayPickerInput
                        ref={el => (this.to = el)}
                        value={ordersHistoryTo}
                        placeholder="To"
                        format="LL"
                        formatDate={formatDate}
                        parseDate={parseDate}
                        dayPickerProps={{
                          selectedDays: [ordersHistoryFrom, { ordersHistoryFrom, ordersHistoryTo }],
                          disabledDays: { before: ordersHistoryFrom },
                          modifiers,
                          month: ordersHistoryFrom,
                          fromMonth: ordersHistoryFrom,
                          numberOfMonths: 2
                        }}
                        onDayChange={this.handleToChange}
                      />
                    </span>
                    <Helmet>
                      <style>{`
  .InputFromTo .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
    background-color: #f0f8ff !important;
    color: #4a90e2;
  }
  .InputFromTo .DayPicker-Day {
    border-radius: 0 !important;
  }
  .InputFromTo .DayPicker-Day--start {
    border-top-left-radius: 50% !important;
    border-bottom-left-radius: 50% !important;
  }
  .InputFromTo .DayPicker-Day--end {
    border-top-right-radius: 50% !important;
    border-bottom-right-radius: 50% !important;
  }
  .InputFromTo .DayPickerInput-Overlay {
    width: 550px;
  }
  .InputFromTo-to .DayPickerInput-Overlay {
    margin-left: -198px;
  }
`}</style>
                    </Helmet>
                  </div>
                </Col>
                <Col>
                  <button onClick={this.handleSearch}>Search</button>
                </Col>
              </Row>

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
                                      ) /
                                          o.orderDetails.reduce((acc, curr) => acc + curr.amount, 0)
                                    )
                                  : o.status === ORDER_STATUS_CANCELLED
                                    ? o.orderDetails.length === 0
                                      ? 0
                                      : Math.round(
                                        o.orderDetails
                                          .filter(
                                            od =>
                                              od.deal_status ===
                                                ORDER_DETAIL_DEAL_STATUS_CANCELLED
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

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <InputPairContainer>
                  <Header6 className="p-1">Total {ordersHistoryCount}</Header6>
                  <div className="p-5" style={{ width: '160px' }}>
                    <Select
                      value={ordersHistoryPageSize}
                      onChange={this.handlePageSizeChange}
                      options={pageSizeOptions}
                    />
                  </div>
                </InputPairContainer>
                <Pagination
                  aria-label="orders pagination"
                  style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <PaginationItem>
                    <PaginationLink
                      previous
                      onClick={() => this.pageClicked(ordersHistoryPage - 1)}
                    />
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
            </ShadowedCard>
          </div>
        </section>
      </Fragment>
    )
  }
}

export default SearchableOrderHistory
