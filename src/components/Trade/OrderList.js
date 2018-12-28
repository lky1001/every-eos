import React, { PureComponent, Fragment } from 'react'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Text, HeaderTable, TokenPrice, PriceIcon, PriceRow, PriceBack } from '../Common/Common'

import { ORDER_PAGE_LIMIT, GET_ORDER_LIST_INTERVAL, ORDER_STATUS_NOT_DEAL, ORDER_STATUS_PARTIAL_DEALED } from '../../constants/Values'
import { isNumber } from 'util'
import ColorsConstant from '../Colors/ColorsConstant'
import styled from 'styled-components'

const BaseRow = styled.tr`
  height: 21px;
  &:hover {
    font-weight: 700;
    cursor: pointer;
  }
`
const BaseColumn = styled.td`
  width: 30%;
  border-style: hidden;
  padding-right: 18px !important;
`

const AmountColumn = styled.td`
  width: 40%;
  border-style: hidden;
  padding-right: 8px !important;
`

const NoOrderColumn = styled.div`
  text-align: center !important;
  font-size: 14px;
  padding: 25px;
  border-top: 1px solid rgba(0, 0, 0, 0.045);
`

class OrderList extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      ordersIntervalId: 0,
      symbol: undefined
    }
  }

  componentWillUnmount = () => {
    this.clearBuySellOrdersInterval()
  }

  startBuySellOrdersInterval = async () => {
    const { tradeStore, token } = this.props

    tradeStore.getBuyOrders(token.id, ORDER_PAGE_LIMIT)
    tradeStore.getSellOrders(token.id, ORDER_PAGE_LIMIT)

    const ordersIntervalId = setInterval(async () => {
      await tradeStore.getBuyOrders(token.id, ORDER_PAGE_LIMIT)
      await tradeStore.getSellOrders(token.id, ORDER_PAGE_LIMIT)
    }, GET_ORDER_LIST_INTERVAL)

    this.setState({
      ordersIntervalId: ordersIntervalId,
      symbol: token.symbol
    })
  }

  clearBuySellOrdersInterval = () => {
    if (this.state.ordersIntervalId > 0) {
      clearInterval(this.state.ordersIntervalId)
    }
  }

  onOrderListClick = price => {
    const { tradeStore } = this.props
    tradeStore.setPrice(price)
  }

  render() {
    const { token, buyOrdersList, sellOrdersList } = this.props

    if (token.symbol !== this.state.symbol) {
      this.clearBuySellOrdersInterval()
      this.startBuySellOrdersInterval()
    }

    const sellMax =
      sellOrdersList.length > 0
        ? sellOrdersList.reduce((prev, curr) => {
            return Math.max(prev, curr.stacked_amount)
          }, 0)
        : 0.0

    const buyMax =
      buyOrdersList.length > 0
        ? buyOrdersList.reduce((prev, curr) => {
            return Math.max(prev, curr.stacked_amount)
          }, 0)
        : 0.0

    return (
      <Fragment>
        <HeaderTable className="table order-list-table" background={ColorsConstant.grayLighter}>
          <thead>
            <tr style={{ height: '46px' }}>
              <th style={{ width: '30%' }}>
                <FormattedMessage id="Price(EOS)" />
              </th>
              <th style={{ width: '40%' }}>
                <FormattedMessage id="Amount" />
                {`(${token.symbol})`}
              </th>
              <th style={{ width: '30%' }}>
                <FormattedMessage id="Total(EOS)" />
              </th>
            </tr>
          </thead>
        </HeaderTable>
        <div className="table-responsive">
          <Table className="order-list-table">
            <tbody>
              {(!sellOrdersList || sellOrdersList.length === 0) && (
                <BaseRow>
                  <BaseColumn>
                    <NoOrderColumn>
                      <FormattedMessage id="No Orders" />
                    </NoOrderColumn>
                  </BaseColumn>
                </BaseRow>
              )}
              {sellOrdersList &&
                sellOrdersList.map((o, i) => {
                  const width = (o.stacked_amount / sellMax) * 100

                  return (
                    <BaseRow key={i} onClick={this.onOrderListClick.bind(this, o.token_price)}>
                      <BaseColumn>
                        <PriceRow down>{o.token_price.toFixed(4)}</PriceRow>
                      </BaseColumn>
                      <AmountColumn>
                        <PriceBack width={width} down>
                          -
                        </PriceBack>
                        <PriceRow position="absolute" right="18px">
                          {o.stacked_amount.toFixed(4)}
                        </PriceRow>
                      </AmountColumn>
                      <BaseColumn>
                        <PriceRow>{Math.abs(o.token_price * o.stacked_amount).toFixed(token.precision)}</PriceRow>
                      </BaseColumn>
                    </BaseRow>
                  )
                })}
            </tbody>
          </Table>
        </div>

        <TokenPrice className="table-responsive" style={{ borderTop: 'solid 1px rgba(162, 162, 162, 0.16)' }}>
          <Text color={token.last_price - token.last_previous_price > 0 ? ColorsConstant.Thick_green : ColorsConstant.Thick_red}>{`${
            token.last_price
          }`}</Text>{' '}
          <PriceIcon
            className={token.last_price - token.last_previous_price > 0 ? 'ion-arrow-up-c' : 'ion-arrow-down-c'}
            color={token.last_price - token.last_previous_price > 0 ? ColorsConstant.Thick_green : ColorsConstant.Thick_red}
          />
        </TokenPrice>

        <div className="table-responsive">
          <Table className="order-list-table">
            <tbody>
              {(!buyOrdersList || buyOrdersList.length === 0) && (
                <BaseRow>
                  <BaseColumn>
                    <NoOrderColumn>
                      <FormattedMessage id="No Orders" />
                    </NoOrderColumn>
                  </BaseColumn>
                </BaseRow>
              )}
              {buyOrdersList &&
                buyOrdersList.map((o, i) => {
                  const width = (o.stacked_amount / buyMax) * 100

                  return (
                    <BaseRow key={i} onClick={this.onOrderListClick.bind(this, o.token_price)}>
                      <BaseColumn>
                        <PriceRow up>{o.token_price.toFixed(4)}</PriceRow>
                      </BaseColumn>
                      <AmountColumn>
                        <PriceBack up width={width}>
                          -
                        </PriceBack>
                        <PriceRow position="absolute" right="18px">
                          {o.stacked_amount.toFixed(4)}
                        </PriceRow>
                      </AmountColumn>
                      <BaseColumn>
                        <PriceRow>{Math.abs(o.token_price * o.stacked_amount).toFixed(token.precision)}</PriceRow>
                      </BaseColumn>
                    </BaseRow>
                  )
                })}
            </tbody>
          </Table>
        </div>
      </Fragment>
    )
  }
}

export default OrderList
