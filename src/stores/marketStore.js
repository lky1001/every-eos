import { decorate, observable, action } from 'mobx'
import axios from 'axios'

class MarketStore {
  tokens = []

  getTokenList = async () => {
    const tokens = await axios('http://localhost:3000/tokens')
  }

  /**
   * symbol : IQ
   * market : IQ_EOS
   */
  getTokenInfo = async (symbol, market) => {
    // last price
    // 24H change
    // 24H High
    // 24H Low
    // 24H Volume
  }

  getCurrentOrder = async accountName => {}

  getOrderHistory = async accountName => {}

  cancelOrder = async (accountName, id) => {}
}

decorate(MarketStore, {
  tokens: observable,
  getTokenList: action
})

export default new MarketStore()
