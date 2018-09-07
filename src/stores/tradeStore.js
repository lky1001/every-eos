import { decorate, observable, set, toJS, computed, action } from 'mobx'
import graphql from 'mobx-apollo'
import ApiServerAgent from '../ApiServerAgent'
import { ordersQuery, ordersByTokenIdQuery } from '../graphql/query/order'

class TradeStore {
  tokenSymbol = ''
  price = 0.0
  amount = 0.0

  orders = {
    data: {
      orders: []
    },
    loading: false,
    error: null
  }

  constructor() {
    set(this, {
      get orders() {
        return graphql({ client: ApiServerAgent, query: ordersQuery })
      }
    })

    this.price = observable.box(0.0)
  }

  setTokenSymbol = symbol => {
    this.tokenSymbol = symbol
  }

  setPrice = price => {
    this.price.set(price)
  }

  setWatchPrice = observer => {
    this.price.observe(observer)
  }

  setAmount = amount => {
    this.amount = amount
  }

  getOrders = async () => {
    this.orders = await graphql({ client: ApiServerAgent, query: ordersQuery })
  }

  getOrdersByTokenId = async token_id => {
    this.orders = await graphql({
      client: ApiServerAgent,
      query: ordersByTokenIdQuery,
      variables: { token_id: token_id }
    })
  }

  get error() {
    return (this.orders.error && this.orders.error.message) || null
  }

  get loading() {
    return this.orders.loading
  }

  get orderList() {
    return (this.orders.data && toJS(this.orders.data.orders)) || []
  }

  get count() {
    return this.orders.data.orders ? this.orders.data.orders.length : 0
  }

  test = () => {
    this.price += 0.1
  }
}

decorate(TradeStore, {
  orders: observable,
  error: computed,
  loading: computed,
  orderList: computed,
  count: computed,
  tokenSymbol: observable,
  price: observable,
  amount: observable,
  setTokenSymbol: action,
  setPrice: action,
  setAmount: action,
  setWatchPrice: action,
  getOrdersByTokenId: action,
  test: action
})

export default new TradeStore()
