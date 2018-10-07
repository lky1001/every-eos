import React, { Component } from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'
import { formatDate, parseDate } from 'react-day-picker/moment'
import Select from 'react-select'
import Helmet from 'react-helmet'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import { InputPairContainer, Header6 } from '../Common/Common'
import { typeOptions, statusOptions } from '../../utils/OrderSearchFilter'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

class FilterBar extends Component {
  handleSearch = () => {
    const { tradeStore, accountStore } = this.props

    tradeStore.setOrdersHistoryPage(1)
    tradeStore.getOrdersHistory(accountStore.loginAccountInfo.account_name)
  }

  handleTypeChange = selectedType => {
    const { tradeStore } = this.props
    tradeStore.setOrdersHistoryType(selectedType)
  }

  handleStatusChange = selectedStatus => {
    const { tradeStore } = this.props
    tradeStore.setOrdersHistoryStatus(selectedStatus)
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

  handleTokenSymbolChange = s => {
    const { tradeStore } = this.props

    tradeStore.setTokenSymbolForSearch(s.target.value)
  }

  handleFromChange = from => {
    const { tradeStore } = this.props
    tradeStore.setOrdersHistoryFrom(from)
  }

  handleToChange = to => {
    const { tradeStore } = this.props
    tradeStore.setOrdersHistoryTo(to)
  }

  render() {
    const {
      ordersHistoryFrom,
      ordersHistoryTo,
      ordersHistoryType,
      ordersHistoryStatus
    } = this.props

    const modifiers = { start: ordersHistoryFrom, end: ordersHistoryTo }

    return (
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
    )
  }
}

export default compose(
  inject('tradeStore', 'accountStore'),
  observer
)(FilterBar)
