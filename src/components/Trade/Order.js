import React, { Component, Fragment } from 'react'
import classnames from 'classnames'
import { Row, Col, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { FormattedMessage } from 'react-intl'
import {
  EOS_TOKEN,
  SCATTER_ERROR_LOCKED,
  SCATTER_ERROR_REJECT_TRANSACTION_BY_USER
} from '../../constants/Values'

class Order extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      tabIndex: 0,
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
    const { eosioStore, accountStore, tradeStore, token } = this.props

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
          tradeStore.getPollingOrderByTxId(result.transaction_id)
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
      qty: 0.0001,
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
          tradeStore.getPollingOrderByTxId(result.transaction_id)
        }
      } catch (e) {
        this.handleError(e)
      }
    } else {
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
    const { token } = this.props

    return (
      <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
        <TabList>
          <Tab>
            <FormattedMessage id="Limit Order" />
          </Tab>
          <Tab>
            <FormattedMessage id="Market Order" />
          </Tab>
        </TabList>

        <TabPanel style={{ fontSize: '1.25rem' }}>
          <Row>
            <Col sm="6">
              <Row style={{ height: '40px', margin: '12px', alignItems: 'center' }}>
                <Col sm="3" style={{ textAlign: 'right', paddingRight: '8px' }}>
                  Available
                </Col>
                <Col sm="9">234.22 EOS</Col>
              </Row>
              <Row style={{ height: '40px', margin: '12px', alignItems: 'center' }}>
                <Col sm="3" style={{ textAlign: 'right', paddingRight: '8px' }}>
                  Price
                </Col>
                <Col sm="9">
                  <InputGroup>
                    <Input
                      type="number"
                      value={this.state.buyPrice}
                      onChange={this.handleChange.bind(this)}
                      step="1"
                      style={{ height: '40px', fontSize: '1.5rem' }}
                    />
                    <InputGroupAddon addonType="append">EOS</InputGroupAddon>
                  </InputGroup>
                </Col>
              </Row>
              <Row style={{ height: '40px', margin: '12px', alignItems: 'center' }}>
                <Col sm="3" style={{ textAlign: 'right', paddingRight: '8px' }}>
                  Amount
                </Col>
                <Col sm="9">
                  <InputGroup>
                    <Input
                      placeholder="Amount"
                      type="number"
                      step="1"
                      onChange={this.handleChange.bind(this)}
                      value={this.state.buyQty}
                      style={{ height: '40px', fontSize: '1.5rem' }}
                    />
                    <InputGroupAddon addonType="append">{token.symbol}</InputGroupAddon>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="3" />
                <Col sm="9">
                  <button onClick={this.onBuyLimitClick}>Buy</button>
                </Col>
              </Row>
            </Col>
            <Col sm="6">
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
              <button onClick={this.onSellLimitClick}>Sell Limit</button>
            </Col>
          </Row>
        </TabPanel>
        <TabPanel>
          <Row>
            <Col sm="6">
              buy total(EOS){' '}
              <input
                type="text"
                name="buyMarketTotalEos"
                onChange={this.handleChange.bind(this)}
                value={this.state.buyMarketTotalEos}
                placeholder="buy total in eos"
              />
              <br />
              <button onClick={this.onBuyMarketClick}>Buy Market</button>
            </Col>
            <Col sm="6">
              sell amount{' '}
              <input
                type="text"
                name="sellMarketAmount"
                onChange={this.handleChange.bind(this)}
                value={this.state.sellMarketAmount}
                placeholder="sell amount"
              />
              <br />
              <button onClick={this.onSellMarketClick}>Sell Market</button>
            </Col>
          </Row>
        </TabPanel>
      </Tabs>
    )
  }
}

export default Order
