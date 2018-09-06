import React, { Component, Fragment } from 'react'
import * as Values from '../../constants/Values'

import { inject, observer } from 'mobx-react'
import { compose } from 'recompose'

class Order extends Component {
  constructor(props) {
    super(props)

    this.state = {
      buyPrice: 0.0,
      buyQty: 0.0,
      sellPrice: 0.0,
      sellQty: 0.0
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

    const eosAmount = (this.state.buyPrice * this.state.buyQty).toFixed(Values.EOS_TOKEN.precision)

    const tokenPriceInEos = parseFloat(this.state.buyPrice).toFixed(Values.EOS_TOKEN.precision)
    const tokenQty = parseFloat(this.state.buyQty).toFixed(Values.EOS_TOKEN.precision)

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
        precision: Values.EOS_TOKEN.precision,
        symbol: Values.EOS_TOKEN.symbol,
        memo: JSON.stringify(memo)
      }

      const result = await eosioStore.buyToken(Values.EOS_TOKEN.contract, data)
    } else {
    }
  }

  onBuyMarketClick = async () => {}

  onSellLimitClick = async () => {
    const { eosioStore, accountStore, token } = this.props

    const eosAmount = (this.state.sellPrice * this.state.sellQty).toFixed(token.precision)

    const tokenPriceInEos = parseFloat(this.state.sellPrice).toFixed(token.precision)
    const tokenQty = parseFloat(this.state.sellQty).toFixed(token.precision)

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

      const result = await eosioStore.buyToken(token.contract, data)
    } else {
    }
  }

  onSellMarketClick = async () => {}

  render() {
    return (
      <Fragment>
        buy price <input type="text" name="buyPrice" onChange={this.handleChange.bind(this)} value={this.state.buyPrice} placeholder="buy price" />
        <br />
        buy amount <input type="text" name="buyQty" onChange={this.handleChange.bind(this)} value={this.state.buyQty} placeholder="buy qty" />
        <br />
        sell price{' '}
        <input type="text" name="sellPrice" onChange={this.handleChange.bind(this)} value={this.state.sellPrice} placeholder="sell price" />
        <br />
        sell amount <input type="text" name="sellQty" onChange={this.handleChange.bind(this)} value={this.state.sellQty} placeholder="sell qty" />
        <br />
        <button onClick={this.onBuyLimitClick}>Buy Limit</button>
        <button onClick={this.onSellLimitClick}>Sell Limit</button>
      </Fragment>
    )
  }
}

export default Order
