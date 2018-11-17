import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { GET_LAST_TRADE_INTERVAL } from '../../constants/Values'
import { FormattedMessage } from 'react-intl'
import { Table } from 'reactstrap'
import { PriceRow } from '../Common/Common'
import { Scrollbars } from 'react-custom-scrollbars'
import { Row, Col } from 'react-bootstrap'
import { HeaderTable } from '../Common/Common'

const LatestTradeListTitle = styled.div`
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

class LatestTradeList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      latestTradeIntervalId: 0
    }
  }

  componentDidMount = () => {
    const { tradeStore, token } = this.props

    tradeStore.getlatestTrades(token.id)

    const latestTradeIntervalId = setInterval(async () => {
      tradeStore.getlatestTrades(token.id)
    }, GET_LAST_TRADE_INTERVAL)

    this.setState({
      latestTradeIntervalId: latestTradeIntervalId
    })
  }

  componentWillUnmount = () => {
    if (this.state.latestTradeIntervalId > 0) {
      clearInterval(this.state.latestTradeIntervalId)
    }
  }

  render() {
    const { tradeStore, latestTradesError, latestTradesLoading, latestTradesList } = this.props

    console.log(latestTradesList)
    return (
      <Fragment>
        <LatestTradeListTitle className="table-responsive">
          <FormattedMessage id="LatestTradeListTitle" />
        </LatestTradeListTitle>
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
        <Scrollbars style={{ height: '220px' }}>
          <Table className="order-list-table responsive hover">
            <tbody>
              {!latestTradesLoading &&
                latestTradesList.map((latestTrade, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{latestTrade.transaction_id}</td>
                      <td>{latestTrade.deal_type}</td>
                      <td>{latestTrade.token_price * latestTrade.amount}</td>
                      <td>{latestTrade.amount}</td>
                    </tr>
                  )
                })}
            </tbody>
          </Table>
        </Scrollbars>
      </Fragment>
    )
  }
}

export default LatestTradeList
