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

import styled from 'styled-components'

const CardContainer = styled(Container)`
  background: #fff;
  border-radius: 2px;
  display: inline-block;
  position: relative;
`

const ShadowedCard = styled(CardContainer)`
  box-shadow: 0 8px 38px rgba(133, 133, 133, 0.3), 0 5px 12px rgba(133, 133, 133, 0.22);
`

const InputPairContainer = styled.div`
  display: flex;
  align-items: center;
`

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

    this.state = {
      activeTab: '1',
      currentPage: 1,
      pageSize: pageSize,
      pageCount: 1,
      token_symbol: null,
      from: subDays(new Date(), 7),
      to: new Date(),
      selectedType: typeOptions[0],
      selectedStatus: statusOptions[0]
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
      this.state.pageSize,
      this.state.currentPage,
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

  render() {
    const { accountStore, ordersHistoryList } = this.props
    const { from, to, selectedType, selectedStatus } = this.state
    const modifiers = { start: from, end: to }

    return (
      <Fragment>
        <h5> Order History</h5>
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
          <Row>
            <Col>
              <Table>
                <thead>
                  <tr>
                    <th>
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
                <tbody>
                  {accountStore.isLogin &&
                    ordersHistoryList &&
                    ordersHistoryList.map(o => {
                      return (
                        <tr key={o.id}>
                          <td>{o.created}</td>
                          <td>{o.token_id}</td>
                          <td>{o.type}</td>
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
                                              od.deal_status === ORDER_DETAIL_DEAL_STATUS_CANCELLED
                                          )
                                          .reduce((acc, curr) => acc + curr.amount, 0)
                                  )
                                : '-'}
                          </td>
                          <td>{o.total_amount}</td>
                          <td>{o.deal_amount}</td>
                          <td>-</td>
                          {/* {Math.abs(
                      o.token_price.toFixed(token.precision) *
                        o.total_amount.toFixed(token.precision)
                    ).toFixed(token.precision)} */}
                          <td>{o.status}</td>
                        </tr>
                      )
                    })}

                  <Pagination aria-label="Page navigation example">
                    <PaginationItem disabled>
                      <PaginationLink previous href="#" />
                    </PaginationItem>
                    {ordersHistoryList &&
                      Array(this.state.pageCount)
                        .fill(null)
                        .map(
                          (value, index) =>
                            this.state.currentPage === index + 1 ? (
                              <PaginationItem active>
                                <PaginationLink href="#">{index + 1}</PaginationLink>
                              </PaginationItem>
                            ) : (
                              <PaginationItem>
                                <PaginationLink href="#">{index + 1}</PaginationLink>
                              </PaginationItem>
                            )
                        )}
                    <PaginationItem>
                      <PaginationLink next href="#" />
                    </PaginationItem>
                  </Pagination>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row />
        </ShadowedCard>
      </Fragment>
    )
  }
}

export default SearchableOrderHistory
