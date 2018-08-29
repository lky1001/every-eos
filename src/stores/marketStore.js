import { decorate, observable, action } from 'mobx'
import axios from 'axios'

class MarketStore {
  tokens = []

  getTokenList = async () => {
    const tokens = await axios('http://localhost:3000/tokens')
  }
}

decorate(MarketStore, {
  tokens: observable,
  getTokenList: action
})

export default new MarketStore()
