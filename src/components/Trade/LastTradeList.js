import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { GET_BALANCE_INTERVAL } from '../../constants/Values'
import { FormattedMessage } from 'react-intl'
import { Table } from 'reactstrap'
import { PriceRow } from '../Common/Common'
import { Scrollbars } from 'react-custom-scrollbars'
import { Row, Col } from 'react-bootstrap'
import { HeaderTable } from '../Common/Common'

const LastTradeListTitle = styled.div`
  height: 44px;
  background: white;
  vertical-align: middle;
  text-align: center;
  font-size: 18px;
  padding: 8px;
  overflow: hidden;
  border-bottom: 1px solid rgb(217, 217, 217);
  border-top: 1px solid rgb(217, 217, 217);
`

class LastTradeList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Fragment>
        <LastTradeListTitle className="table-responsive">
          <FormattedMessage id="LastTradeListTitle" />
        </LastTradeListTitle>
        <HeaderTable className="table order-list-table">
          <thead>
            <tr>
              <th style={{ width: '27%', textAlign: 'center' }}>
                <FormattedMessage id="Tx" />
              </th>
              <th style={{ width: '17%', textAlign: 'center' }}>
                <FormattedMessage id="TradeType" />
              </th>
              <th style={{ width: '31%', textAlign: 'center' }}>
                <FormattedMessage id="TradePrice" />
              </th>
              <th style={{ width: '25%', textAlign: 'center' }}>
                <FormattedMessage id="TradeQuantity" />
              </th>
            </tr>
          </thead>
        </HeaderTable>
        <Scrollbars style={{ height: '220px' }} />
      </Fragment>
    )
  }
}

export default LastTradeList
