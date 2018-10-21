import React, { Component } from 'react'
import Select from 'react-select'
import { format } from 'date-fns'
import { Row, Col } from 'reactstrap'
import { InputPairContainer, Header6, CommonSearchBoxDiv, BaseLargeButton } from '../Common/Common'
import { typeOptions, statusOptions } from '../../utils/OrderSearchFilter'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import { FormattedMessage } from 'react-intl'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-daterangepicker/daterangepicker.css'

class FilterBar extends Component {
  handleDateRangeChange = (event, picker) => {
    const { handleFromChange, handleToChange } = this.props

    handleFromChange(picker.startDate.toDate())
    handleToChange(picker.endDate.toDate())
  }

  render() {
    const {
      ordersHistoryFrom,
      ordersHistoryTo,
      ordersHistoryType,
      ordersHistoryStatus,
      handleSearch,
      handleTypeChange,
      handleStatusChange,
      handleTokenSymbolChange,
      handleFromChange,
      handleToChange
    } = this.props

    return (
      <Row>
        <Col>
          <InputPairContainer>
            <Header6 className="p-1">
              <FormattedMessage id="Token" />
            </Header6>
            <div className="p-5">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter Symbol"
                onChange={s => handleTokenSymbolChange(s)}
              />
            </div>
          </InputPairContainer>
        </Col>
        <Col>
          <InputPairContainer>
            <Header6 className="p-1">
              <FormattedMessage id="Type" />
            </Header6>
            <div className="p-5" style={{ width: '100%' }}>
              <Select value={ordersHistoryType} onChange={handleTypeChange} options={typeOptions} />
            </div>
          </InputPairContainer>
        </Col>

        <Col>
          <InputPairContainer>
            <Header6 className="p-1">
              <FormattedMessage id="Status" />
            </Header6>
            <div className="p-5" style={{ width: '100%' }}>
              <Select
                value={ordersHistoryStatus}
                onChange={handleStatusChange}
                options={statusOptions}
              />
            </div>
          </InputPairContainer>
        </Col>

        <Col>
          <InputPairContainer>
            <Header6 className="p-1">
              <FormattedMessage id="Range" />
            </Header6>
            <div className="p-5" style={{ width: '100%' }}>
              <DateRangePicker
                onApply={this.handleDateRangeChange}
                startDate={ordersHistoryFrom}
                endDate={ordersHistoryTo}
              >
                <BaseLargeButton size="lg" block outline color="primary">{`${format(
                  ordersHistoryFrom,
                  'MM/DD/YYYY'
                )} ~ ${format(ordersHistoryTo, 'MM/DD/YYYY')}`}</BaseLargeButton>
              </DateRangePicker>
            </div>
          </InputPairContainer>
        </Col>
        <CommonSearchBoxDiv>
          <BaseLargeButton size="lg" block color="primary" onClick={handleSearch}>
            <FormattedMessage id="Search" />
          </BaseLargeButton>
        </CommonSearchBoxDiv>
      </Row>
    )
  }
}

export default FilterBar
