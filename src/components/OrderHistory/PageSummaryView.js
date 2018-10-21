import React, { Component } from 'react'
import { pageSizeOptions } from '../../utils/OrderSearchFilter'
import { Header6, RightAlignCol } from '../Common/Common'
import { Row, Col } from 'reactstrap'
import ColorsConstant from '../Colors/ColorsConstant'
import Select from 'react-select'

class PageSummaryView extends Component {
  render() {
    const { ordersHistoryCount, ordersHistoryPageSize, handlePageSizeChange } = this.props
    return (
      <Row
        style={{
          padding: '32px 0px',
          borderTop: ColorsConstant.Trade_border_style
        }}
      >
        <Col sm="10">
          <Header6 style={{ textAlign: 'left' }} className="p-1">
            Total {ordersHistoryCount}
          </Header6>
        </Col>
        <RightAlignCol sm="2">
          <Select
            value={ordersHistoryPageSize}
            onChange={handlePageSizeChange}
            options={pageSizeOptions}
          />
        </RightAlignCol>
      </Row>
    )
  }
}

export default PageSummaryView
