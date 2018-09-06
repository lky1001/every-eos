import { decorate, observable, action } from 'mobx'
import graphql from 'mobx-apollo'

class TradeStore {
  buyPrice = 0.0

  test = () => {
    this.buyPrice += 0.1
  }
}

decorate(TradeStore, {
  buyPrice: observable,
  test: action
})

export default new TradeStore()
