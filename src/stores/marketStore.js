import { decorate, observable, action } from 'mobx'
import axios from 'axios'

class MarketStore {
  coins = []

  getCoinList = async () => {
    const coins = await axios('http://localhost:3000/coins')
  }
}

decorate(MarketStore, {
  coins: observable,
  getCoinList: action
})

export default new MarketStore()
