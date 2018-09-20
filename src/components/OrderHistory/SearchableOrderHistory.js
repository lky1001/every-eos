import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { FormattedMessage } from 'react-intl'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'
import Select from 'react-select'
import Helmet from 'react-helmet'
import { subDays } from 'date-fns'
import moment from 'moment'
import { formatDate, parseDate } from 'react-day-picker/moment'
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
  ORDER_STATUS_NOT_DEAL,
  ORDER_STATUS_PARTIAL_DEALED,
  ORDER_STATUS_ALL_DEALED,
  ORDER_STATUS_CANCELLED,
  ORDER_DETAIL_DEAL_STATUS_CANCELLED,
  ORDER_TYPE_BUY,
  ORDER_TYPE_SELL,
  SELECT_ORDER_TYPE_ALL,
  SELECT_ORDER_TYPE_BUY,
  SELECT_ORDER_TYPE_SELL,
  SELECT_ORDER_STATUS_ALL,
  SELECT_ORDER_STATUS_IN_PROGRESS,
  SELECT_ORDER_STATUS_COMPLETED,
  SELECT_ORDER_STATUS_CANCELLED
} from '../../constants/Values'

import { Text, ShadowedCard, InputPairContainer } from '../Common/Common'

const typeOptions = [
  { value: '', label: SELECT_ORDER_TYPE_ALL },
  { value: ORDER_TYPE_BUY, label: SELECT_ORDER_TYPE_BUY },
  { value: ORDER_TYPE_SELL, label: SELECT_ORDER_TYPE_SELL }
]

const statusOptions = [
  { value: '', label: SELECT_ORDER_STATUS_ALL },
  {
    value: [ORDER_STATUS_NOT_DEAL, ORDER_STATUS_PARTIAL_DEALED],
    label: SELECT_ORDER_STATUS_IN_PROGRESS
  },
  { value: ORDER_STATUS_ALL_DEALED, label: SELECT_ORDER_STATUS_COMPLETED },
  { value: ORDER_STATUS_CANCELLED, label: SELECT_ORDER_STATUS_CANCELLED }
]

class SearchableOrderHistory extends Component {
  constructor(props) {
    super(props)
    const { pageSize } = props
    const today = new Date()

    this.state = {
      activeTab: '1',
      currentPage: 1,
      pageSize: pageSize,
      pageCount: 1,
      token_symbol: null,
      from: subDays(today, 7),
      to: today,
      selectedType: typeOptions[0],
      selectedStatus: statusOptions[0]
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { ordersHistoryCount } = nextProps

    const pageCount =
      ordersHistoryCount > 0 ? Math.ceil(ordersHistoryCount / prevState.pageSize) : 1

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
        if (changed.newValue) {
          this.getOrderHistory()
        } else {
          tradeStore.clearOrdersHistory()
        }
      })
    }
  }

  getOrderHistory = async () => {
    const { tradeStore, accountStore } = this.props
    const { token_symbol, from, to } = this.state

    await tradeStore.getOrdersHistory(
      accountStore.loginAccountInfo.account_name,
      token_symbol,
      this.getTypeFilter(),
      this.getStatusFilter(),
      0,
      0,
      from,
      to
    )
  }

  componentWillUnmount = () => {
    if (this.disposer) this.disposer()
  }

  handleTypeChange = selectedType => {
    this.setState({ selectedType })
  }

  handleStatusChange = selectedStatus => {
    this.setState({ selectedStatus })
  }

  showFromMonth = () => {
    const { from, to } = this.state
    if (!from) {
      return
    }
    if (moment(to).diff(moment(from), 'months') < 2) {
      this.to.getDayPicker().showMonth(from)
    }
  }

  handleTokenSymbolChange = symbol => {
    this.setState({
      token_symbol: symbol.target.value
    })
  }

  handleFromChange = from => {
    this.setState({
      from
    })
  }

  handleToChange = to => {
    this.setState({
      to
    })
  }

  getTypeFilter = () => {
    const { selectedType } = this.state

    if (selectedType.label === SELECT_ORDER_TYPE_ALL) {
      return JSON.stringify([ORDER_TYPE_BUY, ORDER_TYPE_SELL])
    } else if (selectedType.label === SELECT_ORDER_TYPE_BUY) {
      return JSON.stringify(ORDER_TYPE_BUY)
    } else if (selectedType.label === SELECT_ORDER_TYPE_SELL) {
      return JSON.stringify(ORDER_TYPE_SELL)
    }
  }

  getStatusFilter = () => {
    const { selectedStatus } = this.state

    if (selectedStatus.label === SELECT_ORDER_STATUS_ALL) {
      return JSON.stringify([
        ORDER_STATUS_NOT_DEAL,
        ORDER_STATUS_PARTIAL_DEALED,
        ORDER_STATUS_ALL_DEALED,
        ORDER_STATUS_CANCELLED
      ])
    } else if (selectedStatus.label === SELECT_ORDER_STATUS_IN_PROGRESS) {
      return JSON.stringify([ORDER_STATUS_NOT_DEAL, ORDER_STATUS_PARTIAL_DEALED])
    } else if (selectedStatus.label === SELECT_ORDER_STATUS_COMPLETED) {
      return JSON.stringify(ORDER_STATUS_ALL_DEALED)
    } else if (selectedStatus.label === SELECT_ORDER_STATUS_CANCELLED) {
      return JSON.stringify(ORDER_STATUS_CANCELLED)
    }
  }

  pageClicked = idx => {
    const { pageCount } = this.state

    if (idx > 0 && idx <= pageCount) {
      this.setState({
        currentPage: idx
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
    const { from, to, selectedType, selectedStatus, pageCount, pageSize, currentPage } = this.state
    const modifiers = { start: from, end: to }
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize

    return (
      <Fragment>
        <section>
          <div className="container-fluid">
            <h5 className="mt0">Order History</h5>
            <ShadowedCard>
              <Row>
                <Col>
                  <InputPairContainer>
                    <div className="p-1">Token</div>
                    <div className="p-5">
                      <Input
                        type="text"
                        name="token"
                        id="token"
                        placeholder="Please enter"
                        onChange={s => this.handleTokenSymbolChange(s)}
                      />
                    </div>
                  </InputPairContainer>
                </Col>
                <Col>
                  <InputPairContainer>
                    <div className="p-1">Type</div>
                    <div className="p-5" style={{ width: '100%' }}>
                      <Select
                        value={selectedType}
                        onChange={this.handleTypeChange}
                        options={typeOptions}
                      />
                    </div>
                  </InputPairContainer>
                </Col>

                <Col>
                  <InputPairContainer>
                    <div className="p-1">Status</div>
                    <div className="p-5" style={{ width: '100%' }}>
                      <Select
                        value={selectedStatus}
                        onChange={this.handleStatusChange}
                        options={statusOptions}
                      />
                    </div>
                  </InputPairContainer>
                </Col>

                <Col>
                  <div className="InputFromTo">
                    <DayPickerInput
                      value={from}
                      placeholder="From"
                      format="LL"
                      formatDate={formatDate}
                      parseDate={parseDate}
                      dayPickerProps={{
                        selectedDays: [from, { from, to }],
                        disabledDays: { after: to },
                        toMonth: to,
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
                        value={to}
                        placeholder="To"
                        format="LL"
                        formatDate={formatDate}
                        parseDate={parseDate}
                        dayPickerProps={{
                          selectedDays: [from, { from, to }],
                          disabledDays: { before: from },
                          modifiers,
                          month: from,
                          fromMonth: from,
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
                    <button onClick={this.getOrderHistory}>Search</button>
                  </div>
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
                        {ordersHistoryList.slice(startIndex, endIndex).map(o => {
                          return (
                            <tr key={o.id}>
                              <td>
                                <Text>{o.created}</Text>
                              </td>
                              <td>
                                <Text color={'Blue'}>
                                  {o.token.symbol} / {o.token.market}
                                </Text>
                              </td>
                              <td>
                                <Text color={o.type === ORDER_TYPE_BUY ? 'Green' : 'Red'}>
                                  {o.type}
                                </Text>
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
                              <td>{o.total_amount}</td>
                              <td>{o.deal_amount}</td>
                              <td>-</td>
                              <td>{o.status}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    )}
                </table>

                {accountStore.isLogin ? (
                  !ordersHistoryList ||
                  (ordersHistoryCount === 0 && (
                    <div style={{ textAlign: 'center' }}>
                      <FormattedMessage id="No Data" />
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <FormattedMessage id="Please Login" />
                  </div>
                )}

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
            </ShadowedCard>
          </div>
        </section>
      </Fragment>
    )
  }
}

export default SearchableOrderHistory
