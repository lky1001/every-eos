import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'
import { Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import classnames from 'classnames'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import { ORDER_PAGE_LIMIT, GET_IN_ORDER_INTERVAL } from '../../constants/Values'
import eosAgent from '../../EosAgent'

class InOrder extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      activeTab: '1',
      getInOrdersIntervalId: 0
    }
  }

  componentDidMount = async () => {
    const { accountStore } = this.props

    if (accountStore.isLogin) {
      this.startGetInOrder()
    }

    this.disposer = accountStore.subscribeLoginState(changed => {
      if (changed.oldValue !== changed.newValue) {
        if (changed.newValue) {
          this.startGetInOrder()
        } else {
          clearInterval(this.state.getInOrdersIntervalId)
        }
      }
    })
  }

  startGetInOrder = () => {
    const getInOrdersIntervalId = setInterval(async () => {
      const { tradeStore, accountStore } = this.props
      await tradeStore.getInOrders(accountStore.loginAccountInfo.account_name, ORDER_PAGE_LIMIT)
    }, GET_IN_ORDER_INTERVAL)

    this.setState({
      getInOrdersIntervalId: getInOrdersIntervalId
    })
  }

  componentWillUnmount = () => {
    if (this.state.getInOrdersIntervalId > 0) {
      clearInterval(this.state.getInOrdersIntervalId)
    }

    this.disposer()
  }

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  cancelOrder = async () => {
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
        signature
      )

      console.log('API서버에서 콜백 : ', result)
    }
  }

  render() {
    const { tradeStore, accountStore } = this.props
    const { inOrdersList } = tradeStore

    return (
      <div>
        <button onClick={() => this.cancelOrder()}>Cancel Order Test</button>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => {
                this.toggle('1')
              }}>
              Order History
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
                </tr>
              </thead>
              <tbody>
                {accountStore.isLogin &&
                  inOrdersList &&
                  inOrdersList.map(o => {
                    return (
                      <tr key={o.id}>
                        <td>{o.created}</td>
                        <td>{o.market}</td>
                        <td>{o.type}</td>
                        <td>{o.token_price}</td>
                        <td>{o.price}</td>
                        <td>{o.total_amount}</td>
                        {/* {Math.abs(
                      o.token_price.toFixed(token.precision) *
                        o.total_amount.toFixed(token.precision)
                    ).toFixed(token.precision)} */}
                        <td>{o.status}</td>
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
)(InOrder)
