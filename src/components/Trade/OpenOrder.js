import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import classnames from 'classnames'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import {
  ORDER_STATUS_NOT_DEAL,
  ORDER_STATUS_PARTIAL_DEALED,
  ORDER_STATUS_ALL_DEALED,
  ORDER_STATUS_CANCELLED,
  ORDER_TYPE_BUY,
  ORDER_DATE_FORMAT
} from '../../constants/Values'
import { Text, ShadowedCard, InputPairContainer, Header6 } from '../Common/Common'
import { ProgressBar } from 'react-bootstrap'

import { typeOptions, getTypeFilter } from '../../utils/OrderSearchFilter'
import eosAgent from '../../EosAgent'
import { format, subDays } from 'date-fns'

class OpenOrder extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      activeTab: '1',
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
        if (changed.newValue === true) {
          this.getOpenOrders()
        } else {
          tradeStore.clearOpenOrders()
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

    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => {
                this.toggle('1')
              }}>
              Open Orders
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <div className="table-responsive bootgrid">
              <table id="bootgrid-basic" className="table table-hover">
                <thead>
                  <tr>
                    <th data-type="date">
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
                      <FormattedMessage id="Entrusted" />
                    </th>
                    <th>
                      <FormattedMessage id="Status" />
                    </th>
                    <th>
                      <FormattedMessage id="Action" />
                    </th>
                  </tr>
                </thead>
                {accountStore.isLogin &&
                  openOrdersList &&
                  openOrdersCount > 0 && (
                    <tbody>
                      {openOrdersList.map(o => {
                        return (
                          <tr key={o.id}>
                            <td>
                              <Header6>{format(o.created, ORDER_DATE_FORMAT)}</Header6>
                            </td>
                            <td>
                              <Header6 color={'Blue'}>
                                {o.token.symbol} / {o.token.market}
                              </Header6>
                            </td>
                            <td>
                              <Header6 color={o.type === ORDER_TYPE_BUY ? 'Green' : 'Red'}>
                                {o.type}
                              </Header6>
                            </td>
                            <td>{o.token_price}</td>
                            <td>
                              <Header6>
                                {o.status === ORDER_STATUS_PARTIAL_DEALED
                                  ? Math.round(
                                    o.orderDetails.reduce(
                                      (acc, curr) => acc + curr.amount * curr.token_price,
                                      0
                                    ) / o.orderDetails.reduce((acc, curr) => acc + curr.amount, 0)
                                  )
                                  : '-'}
                              </Header6>
                            </td>
                            <td>
                              <Header6>{o.total_amount}</Header6>
                            </td>
                            <td>
                              <Header6>{o.deal_amount}</Header6>
                            </td>
                            <td>
                              <Header6>-</Header6>
                            </td>
                            <td>
                              <Header6>{o.status}</Header6>
                            </td>
                            <td>
                              <button onClick={() => this.cancelOrder(o.id)}>Cancel</button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  )}
              </table>
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
            </div>
          </TabPane>
        </TabContent>
      </div>
    )
  }
}

export default OpenOrder
