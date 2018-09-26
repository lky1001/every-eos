import React, { Component, Fragment } from 'react'
import classnames from 'classnames'
import { Row, Col, InputGroup, InputGroupAddon, InputGroupText, Input, Button } from 'reactstrap'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { FormattedMessage } from 'react-intl'
import ColorsConstant from '../Colors/ColorsConstant'
import { RightAlignCol } from '../Common/Common'
import {
  EOS_TOKEN,
  SCATTER_ERROR_LOCKED,
  SCATTER_ERROR_REJECT_TRANSACTION_BY_USER
} from '../../constants/Values'

import styled from 'styled-components'

const OrderTabPanel = styled(TabPanel)`
  font-size: 1.25rem;
`

const OrderRowPanel = styled(Row)`
  height: 40px;
  margin: 12px;
  align-items: center;
`

const OrderColPanel = styled(Col)`
  text-align: right;
  padding-right: 8px;
`

const PrimaryOrderColPanel = styled(OrderColPanel)`
  text-align: left;
  color: ${props =>
    props.buy ? ColorsConstant.Thick_green : props.sell && ColorsConstant.Thick_red};
`

const OrderInput = styled(Input)`
  height: 40px;
  font-size: 1.25rem;
`

const OrderButton = styled(Button)`
  width: 100%;
  height: 40px;
  background: ${props =>
    props.buy ? ColorsConstant.Thick_green : props.sell && ColorsConstant.Thick_red};
`

class Order extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      tabIndex: 0,
      buyPrice: 0.0,
      buyQty: 0.0001,
      sellPrice: 0.0,
      sellQty: 0.0001,
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

        <OrderTabPanel>
          <Row>
            <Col sm="6">
              <OrderRowPanel>
                <PrimaryOrderColPanel sm="3" />
                <PrimaryOrderColPanel sm="3" buy>
                  <FormattedMessage id="Available" />
                </PrimaryOrderColPanel>
                <RightAlignCol sm="6">234.22 EOS</RightAlignCol>
              </OrderRowPanel>
              <OrderRowPanel>
                <OrderColPanel sm="3">Price</OrderColPanel>
                <Col sm="9">
                  <InputGroup>
                    <OrderInput
                      type="number"
                      value={this.state.buyPrice}
                      onChange={this.handleChange.bind(this)}
                      step="1"
                    />
                    <InputGroupAddon addonType="append">EOS</InputGroupAddon>
                  </InputGroup>
                </Col>
              </OrderRowPanel>
              <OrderRowPanel>
                <OrderColPanel sm="3">Amount</OrderColPanel>
                <Col sm="9">
                  <InputGroup style={{ width: '100%' }}>
                    <OrderInput
                      placeholder="Amount"
                      type="number"
                      step="1"
                      onChange={this.handleChange.bind(this)}
                      value={this.state.buyQty}
                    />
                    <InputGroupAddon addonType="append">{token.symbol}</InputGroupAddon>
                  </InputGroup>
                </Col>
              </OrderRowPanel>
              <OrderRowPanel>
                <OrderColPanel sm="3" />
                <Col sm="9">
                  <OrderButton buy onClick={this.onBuyLimitClick}>
                    BUY
                  </OrderButton>
                </Col>
              </OrderRowPanel>
            </Col>

            <Col sm="6">
              <OrderRowPanel>
                <PrimaryOrderColPanel sm="3" />
                <PrimaryOrderColPanel sm="3" sell>
                  <FormattedMessage id="Available" />
                </PrimaryOrderColPanel>
                <RightAlignCol sm="6">301.22 {token.symbol}</RightAlignCol>
              </OrderRowPanel>
              <OrderRowPanel>
                <OrderColPanel sm="3">Price</OrderColPanel>
                <Col sm="9">
                  <InputGroup>
                    <OrderInput
                      type="number"
                      onChange={this.handleChange.bind(this)}
                      value={this.state.sellPrice}
                      step="1"
                    />
                    <InputGroupAddon addonType="append">EOS</InputGroupAddon>
                  </InputGroup>
                </Col>
              </OrderRowPanel>
              <OrderRowPanel>
                <OrderColPanel sm="3">Amount</OrderColPanel>
                <Col sm="9">
                  <InputGroup style={{ width: '100%' }}>
                    <OrderInput
                      placeholder="Amount"
                      type="number"
                      step="1"
                      onChange={this.handleChange.bind(this)}
                      value={this.state.sellQty}
                    />
                    <InputGroupAddon addonType="append">{token.symbol}</InputGroupAddon>
                  </InputGroup>
                </Col>
              </OrderRowPanel>
              <OrderRowPanel>
                <OrderColPanel sm="3" />
                <Col sm="9">
                  <OrderButton sell onClick={this.onSellLimitClick}>
                    SELL
                  </OrderButton>
                </Col>
              </OrderRowPanel>
            </Col>
          </Row>
        </OrderTabPanel>

        <TabPanel>
          <Row>
            <Col sm="6">
              buy total(EOS){' '}
              <OrderInput
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
              <OrderInput
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
