import { decorate, observable, set, toJS, computed, action } from 'mobx'
import graphql from 'mobx-apollo'
import ApiServerAgent from '../ApiServerAgent'
import { ordersByTokenIdQuery } from '../graphql/query/order'
import { getData } from '../utils/stockChartUtil'
import { ORDER_PAGE_LIMIT, ORDER_TYPE_BUY, ORDER_TYPE_SELL } from '../constants/Values'

class TradeStore {
  tokenSymbol = ''
  price = 0.0
  amount = 0.0
  chartData
  buyOrders = {
    data: {
      orders: []
    },
    loading: false,
    error: null
  }

  sellOrders = {
    data: {
      orders: []
    },
    loading: false,
    error: null
  }

  constructor() {
    const initialTokneId = 1
    set(this, {
      get buyOrders() {
        return graphql({
          client: ApiServerAgent,
          query: ordersByTokenIdQuery,
          variables: { token_id: initialTokneId, type: ORDER_TYPE_BUY, limit: ORDER_PAGE_LIMIT }
        })
      }
    })

    set(this, {
      get sellOrders() {
        return graphql({
          client: ApiServerAgent,
          query: ordersByTokenIdQuery,
          variables: { token_id: initialTokneId, type: ORDER_TYPE_SELL, limit: ORDER_PAGE_LIMIT }
        })
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

  getChartData = async () => {
    this.chartData = await getData()
  }

  getBuyOrdersByTokenId = async (token_id, limit) => {
    this.buyOrders = await graphql({
      client: ApiServerAgent,
      query: ordersByTokenIdQuery,
      variables: { token_id: token_id, type: ORDER_TYPE_BUY, limit: limit }
    })
  }

  get buyOrdersError() {
    return (this.buyOrders.error && this.buyOrders.error.message) || null
  }

  get buyOrdersLoading() {
    return this.buyOrders.loading
  }

  get buyOrdersList() {
    return (this.buyOrders.data && toJS(this.buyOrders.data.orders)) || []
  }

  get buyOrdersCount() {
    return this.buyOrders.data.orders ? this.buyOrders.data.orders.length : 0
  }

  getSellOrdersByTokenId = async (token_id, limit) => {
    this.sellOrders = await graphql({
      client: ApiServerAgent,
      query: ordersByTokenIdQuery,
      variables: { token_id: token_id, type: ORDER_TYPE_SELL, limit: limit }
    })
  }

  get sellOrdersError() {
    return (this.sellOrders.error && this.sellOrders.error.message) || null
  }

  get sellOrdersLoading() {
    return this.sellOrders.loading
  }

  get sellOrdersList() {
    return (this.sellOrders.data && toJS(this.sellOrders.data.orders)) || []
  }

  get sellOrdersCount() {
    return this.sellOrders.data.orders ? this.sellOrders.data.orders.length : 0
  }

  test = () => {
    this.price += 0.1
  }
}

decorate(TradeStore, {
  buyOrders: observable,
  buyOrdersError: computed,
  buyOrdersLoading: computed,
  buyOrdersList: computed,
  buyOrdersCount: computed,
  sellOrders: observable,
  sellOrdersError: computed,
  sellOrdersLoading: computed,
  sellOrdersList: computed,
  sellOrdersCount: computed,
  tokenSymbol: observable,
  price: observable,
  amount: observable,
  chartData: observable,
  setTokenSymbol: action,
  setPrice: action,
  setAmount: action,
  setWatchPrice: action,
  getBuyOrdersByTokenId: action,
  getSellOrdersByTokenId: action,
  getChartData: action,
  test: action
})

export default new TradeStore()
