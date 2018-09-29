import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import '../Common/React-tabs.scss'
import { Table, ProgressBar, Button } from 'react-bootstrap'
import { Scrollbars } from 'react-custom-scrollbars'
import {
  HeaderTable,
  TableLgRow,
  OrderBaseColumn,
  DateColumn,
  BuyTypeColumn,
  SellTypeColumn
} from '../Common/Common'
import {
  ORDER_STATUS_NOT_DEAL,
  ORDER_STATUS_PARTIAL_DEALED,
  ORDER_STATUS_ALL_DEALED,
  ORDER_STATUS_CANCELLED,
  ORDER_TYPE_BUY,
  ORDER_DATE_FORMAT
} from '../../constants/Values'

import { typeOptions, getTypeFilter } from '../../utils/OrderSearchFilter'
import eosAgent from '../../EosAgent'
import { format, subDays } from 'date-fns'

class OpenOrder extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      currentPage: 1,
      pageCount: 1,
      token_symbol: null,
      selectedType: typeOptions[0]
    }
  }

  componentDidMount = () => {
    const { accountStore, tradeStore } = this.props

    if (accountStore.isLogin) {
      this.getOpenOrders()
    } else {
      this.disposer = accountStore.subscribeLoginState(changed => {
        if (changed.oldValue !== changed.newValue) {
          if (changed.newValue) {
            this.getOpenOrders()
          } else {
            tradeStore.clearOpenOrders()
          }
        }
      })
    }
  }

  getOpenOrders = async () => {
    const { tradeStore, accountStore } = this.props

    await tradeStore.getOpenOrders(
      accountStore.loginAccountInfo.account_name,
      JSON.stringify([ORDER_STATUS_NOT_DEAL, ORDER_STATUS_PARTIAL_DEALED])
    )
  }

  getOrderHistory = async () => {
    const { tradeStore, accountStore } = this.props
    const { selectedType } = this.state

    const today = new Date()
    await tradeStore.getOrdersHistory(
      accountStore.loginAccountInfo.account_name,
      '',
      getTypeFilter(selectedType),
      JSON.stringify([ORDER_STATUS_ALL_DEALED, ORDER_STATUS_CANCELLED]),
      0,
      0,
      subDays(today, 30),
      today
    )
  }

  componentWillUnmount = () => {
    if (this.disposer) {
      this.disposer()
    }
  }

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  cancelOrder = async order_id => {
    const { accountStore, tradeStore } = this.props

    if (
      accountStore.isLogin &&
      accountStore.loginAccountInfo.account_name &&
      accountStore.loginAccountInfo.permissions &&
      accountStore.loginAccountInfo.permissions.length > 0 &&
      accountStore.loginAccountInfo.permissions[0].required_auth &&
      accountStore.loginAccountInfo.permissions[0].required_auth.keys &&
      accountStore.loginAccountInfo.permissions[0].required_auth.keys.length > 0
    ) {
      const pubKey = accountStore.loginAccountInfo.permissions[0].required_auth.keys[0].key

      const data = JSON.stringify({
        orderId: order_id,
        accountName: accountStore.loginAccountInfo.account_name
      })

      const signature = await eosAgent.signData(data, pubKey)

      if (!signature) {
        alert('check your identity')
        return
      }

      const result = await tradeStore.cancelOrder(data, signature)

      if (result && result.data.cancelOrder) {
        alert('cancel success')
        this.getOpenOrders()
        this.getOrderHistory()
      }
    }
  }

  render() {
    const {
      accountStore,
      openOrdersList,
      openOrdersCount,
      openOrdersLoading,
      openOrdersError
    } = this.props

    const openOrdersContentHeight = `${40 * openOrdersCount}px`
    return (
      <Tabs>
        <TabList>
          <Tab>
            <FormattedMessage id="Open Orders" />
          </Tab>
        </TabList>

        <TabPanel>
          <HeaderTable className="table order-list-table">
            <thead>
              <tr>
                <th data-type="date" style={{ width: '15%', textAlign: 'center' }}>
                  <FormattedMessage id="Date" />
                </th>
                <th style={{ width: '10%', textAlign: 'right' }}>
                  <FormattedMessage id="Pair" />
                </th>
                <th style={{ width: '5%', textAlign: 'right' }}>
                  <FormattedMessage id="Type" />
                </th>
                <th style={{ width: '10%', textAlign: 'right' }}>
                  <FormattedMessage id="Price" />
                </th>
                <th style={{ width: '10%', textAlign: 'right' }}>
                  <FormattedMessage id="Average" />
                </th>
                <th style={{ width: '10%', textAlign: 'right' }}>
                  <FormattedMessage id="Amount" />
                </th>
                <th style={{ width: '10%', textAlign: 'right' }}>
                  <FormattedMessage id="Dealed" />
                </th>
                <th style={{ width: '10%', textAlign: 'right' }}>
                  <FormattedMessage id="Entrusted" />
                </th>
                <th style={{ width: '10%', textAlign: 'right' }}>
                  <FormattedMessage id="Status" />
                </th>
                <th style={{ width: '10%', textAlign: 'right' }}>
                  <FormattedMessage id="Action" />
                </th>
              </tr>
            </thead>
          </HeaderTable>

          <Scrollbars style={{ height: openOrdersContentHeight, maxHeight: `${40 * 20}px` }}>
            <Table className="order-list-table responsive hover">
              {accountStore.isLogin &&
                openOrdersList &&
                openOrdersCount > 0 && (
                  <tbody>
                    {openOrdersList.map(o => {
                      return (
                        <TableLgRow key={o.id}>
                          <DateColumn>{format(o.created, ORDER_DATE_FORMAT)}</DateColumn>
                          <OrderBaseColumn>
                            {o.token.symbol} / {o.token.market}
                          </OrderBaseColumn>
                          {o.type === ORDER_TYPE_BUY ? (
                            <BuyTypeColumn>{o.type}</BuyTypeColumn>
                          ) : (
                            <SellTypeColumn>{o.type}</SellTypeColumn>
                          )}
                          <OrderBaseColumn>{o.token_price.toFixed(4)}</OrderBaseColumn>
                          <OrderBaseColumn>
                            {o.status === ORDER_STATUS_PARTIAL_DEALED
                              ? Math.round(
                                o.orderDetails.reduce(
                                  (acc, curr) => acc + curr.amount * curr.token_price,
                                  0
                                ) / o.orderDetails.reduce((acc, curr) => acc + curr.amount, 0)
                              )
                              : '-'}
                          </OrderBaseColumn>
                          <OrderBaseColumn>{o.total_amount}</OrderBaseColumn>
                          <OrderBaseColumn>{o.deal_amount}</OrderBaseColumn>
                          <OrderBaseColumn>-</OrderBaseColumn>
                          <OrderBaseColumn>
                            <FormattedMessage id={o.status} />
                          </OrderBaseColumn>
                          <OrderBaseColumn>
                            <Button color="link" onClick={() => this.cancelOrder(o.id)}>
                              <FormattedMessage id="Cancel" />
                            </Button>
                          </OrderBaseColumn>
                        </TableLgRow>
                      )
                    })}
                  </tbody>
                )}
            </Table>
          </Scrollbars>
          {accountStore.isLogin ? (
            openOrdersLoading ? (
              <ProgressBar striped bsStyle="success" now={40} />
            ) : (
              (!openOrdersList || openOrdersCount === 0) && (
                <div style={{ textAlign: 'center' }}>
                  <FormattedMessage id="No Data" />
                </div>
              )
            )
          ) : (
            <div style={{ textAlign: 'center' }}>
              <FormattedMessage id="Please Login" />
            </div>
          )}
        </TabPanel>
      </Tabs>
    )
  }
}

export default OpenOrder
