import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import classnames from 'classnames'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import {
  ORDER_PAGE_LIMIT,
  ORDER_STATUS_NOT_DEAL,
  ORDER_STATUS_PARTIAL_DEALED,
  ORDER_STATUS_ALL_DEALED,
  ORDER_STATUS_CANCELLED
} from '../../constants/Values'
import eosAgent from '../../EosAgent'

class OpenOrder extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      activeTab: '1'
    }
  }

  componentDidMount = () => {
    const { accountStore, tradeStore } = this.props

    if (accountStore.isLogin) {
      this.getOpenOrders()
    } else {
      this.disposer = accountStore.subscribeLoginState(changed => {
        if (changed.newValue) {
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
      ORDER_PAGE_LIMIT,
      JSON.stringify([ORDER_STATUS_NOT_DEAL, ORDER_STATUS_PARTIAL_DEALED])
    )
  }

  getOrderHistory = async () => {
    const { tradeStore, accountStore } = this.props

    await tradeStore.getOrdersHistory(
      accountStore.loginAccountInfo.account_name,
      ORDER_PAGE_LIMIT,
      JSON.stringify([ORDER_STATUS_ALL_DEALED, ORDER_STATUS_CANCELLED])
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

      const signature = await eosAgent.signData(accountStore.loginAccountInfo.account_name, pubKey)

      if (!signature) {
        alert('check your identity')
        return
      }

      const result = await tradeStore.cancelOrder(
        accountStore.loginAccountInfo.account_name,
        signature,
        order_id
      )

      if (result && result.data.cancelOrder) {
        alert('cancel success')
        this.getOpenOrders()
        this.getOrderHistory()
      }
    }
  }

  render() {
    const { tradeStore, accountStore } = this.props
    const { openOrdersList } = tradeStore

    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => {
                this.toggle('1')
              }}
            >
              Open Orders
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Table>
              <thead>
                <tr>
                  <th>
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
              <tbody>
                {accountStore.isLogin &&
                  openOrdersList &&
                  openOrdersList.map(o => {
                    return (
                      <tr key={o.id}>
                        <td>{o.created}</td>
                        <td>{o.market}</td>
                        <td>{o.type}</td>
                        <td>{o.token_price}</td>
                        <td>
                          {o.status === ORDER_STATUS_PARTIAL_DEALED
                            ? Math.round(
                              o.orderDetails.reduce(
                                (acc, curr) => acc + curr.amount * curr.token_price,
                                0
                              ) / o.orderDetails.reduce((acc, curr) => acc + curr.amount, 0)
                            )
                            : '-'}
                        </td>
                        <td>{o.total_amount}</td>
                        <td>{o.deal_amount}</td>
                        <td>-</td>
                        {/* {Math.abs(
                      o.token_price.toFixed(token.precision) *
                        o.total_amount.toFixed(token.precision)
                    ).toFixed(token.precision)} */}
                        <td>{o.status}</td>
                        <td>
                          <button onClick={() => this.cancelOrder(o.id)}>Cancel</button>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </Table>
          </TabPane>
        </TabContent>
      </div>
    )
  }
}

export default compose(
  inject('tradeStore', 'accountStore'),
  observer
)(OpenOrder)
