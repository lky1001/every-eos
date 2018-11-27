import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { GET_LAST_TRADE_INTERVAL } from '../../constants/Values'
import { FormattedMessage } from 'react-intl'
import NumberFormat from 'react-number-format'
import { Table } from 'reactstrap'
import { Scrollbars } from 'react-custom-scrollbars'
import { HeaderTable } from '../Common/Common'
import { EOS_TOKEN } from '../../constants/Values'
import ColorsConstant from '../Colors/ColorsConstant.js'

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
const OrderTypeText = styled.span`
  color: ${props =>
    props.buy ? ColorsConstant.Thick_green : props.sell && ColorsConstant.Thick_red};
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
              <th style={{ width: '25%', textAlign: 'center' }}>
                <FormattedMessage id="TradeType" />
              </th>
              <th style={{ width: '23%', textAlign: 'center' }}>
                <FormattedMessage id="TradePrice" />
              </th>
              <th style={{ width: '25%', textAlign: 'right' }}>
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
                      <td style={{ width: '27%' }}>
                        <a
                          href={`https://www.eosuite.app/blockexplorers/${
                            latestTrade.transaction_id
                          }`}
                          target="_blank">
                          {latestTrade.transaction_id.substring(0, 12)}....
                        </a>
                      </td>
                      <td style={{ width: '21%', textAlign: 'center' }}>
                        <OrderTypeText
                          buy={latestTrade.order_type === 'BUY'}
                          sell={latestTrade.order_type === 'SELL'}>
                          <FormattedMessage id={latestTrade.order_type} />
                        </OrderTypeText>
                      </td>
                      <td style={{ width: '31%' }}>
                        <NumberFormat
                          displayType={'text'}
                          suffix=" EOS"
                          value={latestTrade.token_price * latestTrade.amount}
                          fixedDecimalScale={true}
                          decimalScale={EOS_TOKEN.precision}
                        />
                      </td>
                      <td style={{ width: '25%' }}>
                        <NumberFormat
                          displayType={'text'}
                          value={latestTrade.amount}
                          fixedDecimalScale={true}
                          decimalScale={EOS_TOKEN.precision}
                        />
                      </td>
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
