import React, { Component, Fragment } from 'react'
import classnames from 'classnames'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap'
import {
  EOS_TOKEN,
  SCATTER_ERROR_LOCKED,
  SCATTER_ERROR_REJECT_TRANSACTION_BY_USER,
  ORDER_PAGE_LIMIT,
  ORDER_STATUS_NOT_DEAL,
  ORDER_STATUS_PARTIAL_DEALED
} from '../../constants/Values'

class Order extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      activeTab: '1',
      buyPrice: 0.0,
      buyQty: 0.0,
      sellPrice: 0.0,
      sellQty: 0.0,
      buyMarketTotalEos: 0.0,
      sellMarketAmount: 0.0
    }
  }

  componentWillMount = () => {
    const { tradeStore } = this.props
    this.disposer = tradeStore.setWatchPrice(changed => {
      this.setState({
        buyPrice: parseFloat(changed.newValue),
        sellPrice: parseFloat(changed.newValue)
      })
    })
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

  onTestClick = () => {
    const { tradeStore } = this.props
    tradeStore.test()
  }

  handleChange = event => {
    let obj = {}

    obj[event.target.name] = event.target.value

    this.setState(obj)
  }

  onBuyLimitClick = async () => {
    const { eosioStore, accountStore, token } = this.props

    const eosBalance = await accountStore.getTokenBalance(EOS_TOKEN.symbol, EOS_TOKEN.contract)

    const eosAmount = (this.state.buyPrice * this.state.buyQty).toFixed(EOS_TOKEN.precision)

    if (eosAmount > eosBalance) {
      // todo - error balance
      return
    }

    const tokenPriceInEos = parseFloat(this.state.buyPrice).toFixed(EOS_TOKEN.precision)
    const tokenQty = parseFloat(this.state.buyQty).toFixed(EOS_TOKEN.precision)

    const memo = {
      type: 'BUY_LIMIT',
      symbol: token.symbol,
      market: 'EOS',
      price: parseFloat(tokenPriceInEos),
      qty: parseFloat(tokenQty),
      amount: eosAmount
    }

    if (accountStore.isLogin) {
      const data = {
        accountName: accountStore.loginAccountInfo.account_name,
        authority: accountStore.permissions[0].perm_name,
        quantity: eosAmount,
        precision: EOS_TOKEN.precision,
        symbol: EOS_TOKEN.symbol,
        memo: JSON.stringify(memo)
      }

      try {
        const result = await eosioStore.buyToken(EOS_TOKEN.contract, data)

        if (result) {
          alert(JSON.stringify(result))
        }
      } catch (e) {
        this.handleError(e)
      }
    } else {
    }
  }

  onBuyMarketClick = async () => {
    const { eosioStore, accountStore, token } = this.props

    const eosBalance = await accountStore.getTokenBalance(EOS_TOKEN.symbol, EOS_TOKEN.contract)

    const eosAmount = parseFloat(this.state.buyMarketTotalEos).toFixed(EOS_TOKEN.precision)

    if (eosAmount > eosBalance) {
      // todo - error balance
      return
    }

    const memo = {
      type: 'BUY_MARKET',
      symbol: token.symbol,
      market: 'EOS',
      price: 0.0,
      qty: 0.0,
      amount: eosAmount
    }

    if (accountStore.isLogin) {
      const data = {
        accountName: accountStore.loginAccountInfo.account_name,
        authority: accountStore.permissions[0].perm_name,
        quantity: eosAmount,
        precision: EOS_TOKEN.precision,
        symbol: EOS_TOKEN.symbol,
        memo: JSON.stringify(memo)
      }

      try {
        const result = await eosioStore.buyToken(EOS_TOKEN.contract, data)

        if (result) {
          alert(JSON.stringify(result))
        }
      } catch (e) {
        this.handleError(e)
      }
    } else {
    }
  }

  onSellLimitClick = async () => {
    const { eosioStore, accountStore, tradeStore, token } = this.props

    const tokenBalance = await accountStore.getTokenBalance(token.symbol, token.contract)
    const tokenQty = parseFloat(this.state.sellQty).toFixed(token.precision)

    if (tokenQty > tokenBalance) {
      // todo
      return
    }

    const tokenPriceInEos = parseFloat(this.state.sellPrice).toFixed(token.precision)
    const eosAmount = (tokenPriceInEos * tokenQty).toFixed(token.precision)

    const memo = {
      type: 'SELL_LIMIT',
      symbol: token.symbol,
      market: 'EOS',
      price: parseFloat(tokenPriceInEos),
      qty: parseFloat(tokenQty),
      amount: eosAmount
    }

    if (accountStore.isLogin) {
      const data = {
        accountName: accountStore.loginAccountInfo.account_name,
        authority: accountStore.permissions[0].perm_name,
        quantity: tokenQty,
        precision: token.precision,
        symbol: token.symbol,
        memo: JSON.stringify(memo)
      }

      try {
        const result = await eosioStore.buyToken(token.contract, data)

        if (result) {
          tradeStore.getOpenOrderByTxId(result.transaction_id, this.onArrivedOrderByTxId)
        }
      } catch (e) {
        this.handleError(e)
      }
    } else {
    }
  }

  onArrivedOrderByTxId = async () => {
    const { accountStore, tradeStore } = this.props

    if (accountStore.isLogin) {
      await tradeStore.getOpenOrders(
        accountStore.loginAccountInfo.account_name,
        ORDER_PAGE_LIMIT,
        JSON.stringify([ORDER_STATUS_NOT_DEAL, ORDER_STATUS_PARTIAL_DEALED])
      )
    }
  }

  onSellMarketClick = async () => {
    const { eosioStore, accountStore, token } = this.props

    const tokenBalance = await accountStore.getTokenBalance(token.symbol, token.contract)
    const tokenQty = parseFloat(this.state.sellQty).toFixed(token.precision)

    if (tokenQty > tokenBalance) {
      // todo
      return
    }

    const memo = {
      type: 'SELL_MARKET',
      symbol: token.symbol,
      market: 'EOS',
      price: 0.0,
      qty: parseFloat(tokenQty),
      amount: 0.0
    }

    if (accountStore.isLogin) {
      const data = {
        accountName: accountStore.loginAccountInfo.account_name,
        authority: accountStore.permissions[0].perm_name,
        quantity: tokenQty,
        precision: token.precision,
        symbol: token.symbol,
        memo: JSON.stringify(memo)
      }

      try {
        const result = await eosioStore.buyToken(token.contract, data)

        if (result) {
          alert(JSON.stringify(result))
        }
      } catch (e) {
        this.handleError(e)
      }
    } else {
    }
  }

  handleError = e => {
    if (e.code === SCATTER_ERROR_LOCKED) {
      // todo
    } else if (e.code === SCATTER_ERROR_REJECT_TRANSACTION_BY_USER) {
      // todo
    }
  }

  render() {
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
              Limit Order
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => {
                this.toggle('2')
              }}
            >
              Market Order
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <Fragment>
                  buy price{' '}
                  <input
                    type="text"
                    name="buyPrice"
                    onChange={this.handleChange.bind(this)}
                    value={this.state.buyPrice}
                    placeholder="buy price"
                  />
                  <br />
                  buy amount{' '}
                  <input
                    type="text"
                    name="buyQty"
                    onChange={this.handleChange.bind(this)}
                    value={this.state.buyQty}
                    placeholder="buy qty"
                  />
                  <br />
                  sell price{' '}
                  <input
                    type="text"
                    name="sellPrice"
                    onChange={this.handleChange.bind(this)}
                    value={this.state.sellPrice}
                    placeholder="sell price"
                  />
                  <br />
                  sell amount{' '}
                  <input
                    type="text"
                    name="sellQty"
                    onChange={this.handleChange.bind(this)}
                    value={this.state.sellQty}
                    placeholder="sell qty"
                  />
                  <br />
                  <button onClick={this.onBuyLimitClick}>Buy Limit</button>
                  <br />
                  <button onClick={this.onSellLimitClick}>Sell Limit</button>
                </Fragment>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                buy total(EOS){' '}
                <input
                  type="text"
                  name="buyMarketTotalEos"
                  onChange={this.handleChange.bind(this)}
                  value={this.state.buyMarketTotalEos}
                  placeholder="buy total in eos"
                />
                <br />
                sell amount{' '}
                <input
                  type="text"
                  name="sellMarketAmount"
                  onChange={this.handleChange.bind(this)}
                  value={this.state.sellMarketAmount}
                  placeholder="sell amount"
                />
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <button onClick={this.onBuyMarketClick}>Buy Market</button>
                <br />
                <button onClick={this.onSellMarketClick}>Sell Market</button>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    )
  }
}

export default Order
