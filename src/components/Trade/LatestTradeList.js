import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'
import { GET_LAST_TRADE_INTERVAL } from '../../constants/Values'
import { FormattedMessage } from 'react-intl'
import NumberFormat from 'react-number-format'
import { Table, Row, Col } from 'reactstrap'
import { Scrollbars } from 'react-custom-scrollbars'
import { HeaderTable, PriceRow, TableMdRow } from '../Common/Common'
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

const BaseColumn = styled.td`
  text-align: left;
`

const LinkColumn = styled(BaseColumn)`
  width: 10%;
`

const PriceColumn = styled(BaseColumn)`
  width: 20%;
  text-align: right;
`

const AmountColumn = styled(BaseColumn)`
  width: 30%;
  text-align: right;
`

const DateColumn = styled(BaseColumn)`
  width: 40%;
  text-align: right;
`

class LatestTradeList extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      latestTradeIntervalId: 0,
      symbol: undefined
    }
  }

  componentWillUnmount = () => {
    this.clearLastTradeInterval()
  }

  startLastTradeInterval = async () => {
    const { tradeStore, token } = this.props

    const latestTradeIntervalId = setInterval(async () => {
      await tradeStore.getlatestTrades(token.id)
    }, GET_LAST_TRADE_INTERVAL)

    this.setState({
      latestTradeIntervalId: latestTradeIntervalId,
      symbol: token.symbol
    })

    await tradeStore.getlatestTrades(token.id)
  }

  clearLastTradeInterval = () => {
    console.log('clearLastTradeInterval', this.state.latestTradeIntervalId)
    if (this.state.latestTradeIntervalId > 0) {
      clearInterval(this.state.latestTradeIntervalId)
    }
  }

  exploreTransaction = url => {
    window.open(url)
  }

  render() {
    const {
      tradeStore,
      // latestTradesError,
      // latestTradesLoading,
      latestTradesList,
      token
    } = this.props

    if (token.symbol !== this.state.symbol) {
      this.clearLastTradeInterval()
      this.startLastTradeInterval()
    }

    return (
      <Fragment>
        <HeaderTable className="table order-list-table" background={ColorsConstant.grayLighter}>
          <thead>
            <tr style={{ height: '46px' }}>
              <th style={{ width: '10%' }} />
              <th style={{ width: '20%', textAlign: 'right' }}>
                <FormattedMessage id="Price" />
              </th>
              <th style={{ width: '30%', textAlign: 'right' }}>
                <FormattedMessage id="Amount" />
              </th>
              <th style={{ width: '40%', textAlign: 'right' }}>
                <FormattedMessage id="Date" />
              </th>
            </tr>
          </thead>
        </HeaderTable>

        <Scrollbars style={{ height: '380px' }}>
          <Row style={{ height: '380px', margin: '0px' }}>
            <Col xs={12} md={12} style={{ padding: '0px' }}>
              <Table className="order-list-table responsive hover">
                <tbody>
                  {latestTradesList.map((latestTrade, idx) => {
                    return (
                      <TableMdRow
                        key={idx}
                        className="msg-display clickable"
                        onClick={() =>
                          this.exploreTransaction(
                            `https://www.eosuite.app/blockexplorers/${latestTrade.transaction_id}`
                          )
                        }>
                        <LinkColumn />
                        <PriceColumn>
                          <PriceRow
                            up={latestTrade.order_type === 'BUY'}
                            down={latestTrade.order_type === 'SELL'}>
                            <NumberFormat
                              displayType={'text'}
                              value={latestTrade.token_price}
                              fixedDecimalScale={true}
                              decimalScale={EOS_TOKEN.precision}
                            />
                          </PriceRow>
                        </PriceColumn>
                        <AmountColumn>
                          <PriceRow>
                            <NumberFormat
                              value={latestTrade.amount}
                              displayType={'text'}
                              thousandSeparator={true}
                            />
                          </PriceRow>
                        </AmountColumn>

                        {/* 데이터 포맷 간단하게 11-24 12:22:15 이런식으로 TODO... */}
                        <DateColumn>
                          {`${new Date(Date.parse(latestTrade.created)).getMonth() + 1}-${new Date(
                            Date.parse(latestTrade.created)
                          ).getDay() + 1} ${new Date(
                            Date.parse(latestTrade.created)
                          ).toLocaleTimeString()}`}
                        </DateColumn>
                      </TableMdRow>
                    )
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Scrollbars>
      </Fragment>

      // <Fragment>
      //   <LatestTradeListTitle className="table-responsive">
      //     <FormattedMessage id="LatestTradeListTitle" />
      //   </LatestTradeListTitle>
      //   <HeaderTable className="table order-list-table">
      //     <thead>
      //       <tr>
      //         <th style={{ width: '27%', textAlign: 'center' }}>
      //           <FormattedMessage id="Tx" />
      //         </th>
      //         <th style={{ width: '25%', textAlign: 'center' }}>
      //           <FormattedMessage id="TradeType" />
      //         </th>
      //         <th style={{ width: '23%', textAlign: 'center' }}>
      //           <FormattedMessage id="TradePrice" />
      //         </th>
      //         <th style={{ width: '25%', textAlign: 'right' }}>
      //           <FormattedMessage id="TradeQuantity" />
      //         </th>
      //       </tr>
      //     </thead>
      //   </HeaderTable>
      //   <Scrollbars style={{ height: '220px' }}>
      //     <Table className="order-list-table responsive hover">
      //       <tbody>
      //         {!latestTradesLoading &&
      //           latestTradesList.map((latestTrade, idx) => {
      //             return (
      //               <tr key={idx}>
      //                 <td style={{ width: '27%' }}>
      //                   <a
      //                     href={`https://www.eosuite.app/blockexplorers/${
      //                       latestTrade.transaction_id
      //                     }`}
      //                     target="_blank">
      //                     {latestTrade.transaction_id.substring(0, 12)}....
      //                   </a>
      //                 </td>
      //                 <td style={{ width: '21%', textAlign: 'center' }}>
      //                   <OrderTypeText
      //                     buy={latestTrade.order_type === 'BUY'}
      //                     sell={latestTrade.order_type === 'SELL'}>
      //                     <FormattedMessage id={latestTrade.order_type} />
      //                   </OrderTypeText>
      //                 </td>
      //                 <td style={{ width: '31%' }}>
      //                   <NumberFormat
      //                     displayType={'text'}
      //                     suffix=" EOS"
      //                     value={latestTrade.token_price * latestTrade.amount}
      //                     fixedDecimalScale={true}
      //                     decimalScale={EOS_TOKEN.precision}
      //                   />
      //                 </td>
      //                 <td style={{ width: '25%' }}>
      //                   <NumberFormat
      //                     displayType={'text'}
      //                     value={latestTrade.amount}
      //                     fixedDecimalScale={true}
      //                     decimalScale={EOS_TOKEN.precision}
      //                   />
      //                 </td>
      //               </tr>
      //             )
      //           })}
      //       </tbody>
      //     </Table>
      //   </Scrollbars>
      // </Fragment>
    )
  }
}

export default LatestTradeList
