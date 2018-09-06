import { decorate, observable, action } from 'mobx'
import graphql from 'mobx-apollo'

class TradeStore {
  tokenSymbol = ''
  price = 0.0
  amount = 0.0

  test = () => {
    this.price += 0.1
  }
}

decorate(TradeStore, {
  tokenSymbol: observable,
  price: observable,
  amount: observable,
  test: action
})

export default new TradeStore()
