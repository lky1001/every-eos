import { decorate, observable, set, toJS, computed, action } from 'mobx'
import graphql from 'mobx-apollo'
import ApiServerAgent from '../ApiServerAgent'
import { ordersQuery, inOrdersQuery } from '../graphql/query/order'
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

  ordersHistory = {
    data: {
      orders: []
    },
    loading: false,
    error: null
  }

  inOrders = {
    data: {
      orders: []
    },
    loading: false,
    error: null
  }

  constructor() {
    const initialTokenId = 1
    set(this, {
      get buyOrders() {
        return graphql({
          client: ApiServerAgent,
          query: ordersQuery,
          variables: { token_id: initialTokenId, type: ORDER_TYPE_BUY, limit: ORDER_PAGE_LIMIT }
        })
      }
    })

    set(this, {
      get sellOrders() {
        return graphql({
          client: ApiServerAgent,
          query: ordersQuery,
          variables: { token_id: initialTokenId, type: ORDER_TYPE_SELL, limit: ORDER_PAGE_LIMIT }
        })
      }
    })

    set(this, {
      get orderHistory() {
        return graphql({
          client: ApiServerAgent,
          query: ordersQuery,
          variables: { limit: ORDER_PAGE_LIMIT, account_name: '' }
        })
      }
    })

    set(this, {
      get inOrders() {
        return graphql({
          client: ApiServerAgent,
          query: inOrdersQuery,
          variables: { limit: ORDER_PAGE_LIMIT, account_name: '' }
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

  getBuyOrders = async (token_id, limit) => {
    this.buyOrders = await graphql({
      client: ApiServerAgent,
      query: ordersQuery,
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

  getSellOrders = async (token_id, limit) => {
    this.sellOrders = await graphql({
      client: ApiServerAgent,
      query: ordersQuery,
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

  getOrdersHistory = async (account_name, limit) => {
    this.ordersHistory = await graphql({
      client: ApiServerAgent,
      query: ordersQuery,
      variables: { account_name: account_name, limit: limit }
    })
  }

  get ordersHistoryError() {
    return (this.ordersHistory.error && this.ordersHistory.error.message) || null
  }

  get ordersHistoryLoading() {
    return this.ordersHistory.loading
  }

  get ordersHistoryList() {
    return (this.ordersHistory.data && toJS(this.ordersHistory.data.orders)) || []
  }

  get ordersHistoryCount() {
    return this.ordersHistory.data.orders ? this.ordersHistory.data.orders.length : 0
  }

  getInOrders = async (account_name, limit) => {
    this.inOrders = await graphql({
      client: ApiServerAgent,
      query: inOrdersQuery,
      variables: {
        account_name: account_name,
        limit: limit
      }
    })
  }

  get inOrdersError() {
    return (this.inOrders.error && this.inOrders.error.message) || null
  }

  get inOrdersLoading() {
    return this.inOrders.loading
  }

  get inOrdersList() {
    return (this.inOrders.data && toJS(this.inOrders.data.orders)) || []
  }

  get inOrdersCount() {
    return this.inOrders.data.orders ? this.inOrders.data.orders.length : 0
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
  ordersHistory: observable,
  ordersHistoryError: computed,
  ordersHistoryLoading: computed,
  ordersHistoryList: computed,
  ordersHistoryCount: computed,
  inOrders: observable,
  inOrdersError: computed,
  inOrdersLoading: computed,
  inOrdersList: computed,
  inOrdersCount: computed,
  tokenSymbol: observable,
  price: observable,
  amount: observable,
  chartData: observable,
  setTokenSymbol: action,
  setPrice: action,
  setAmount: action,
  setWatchPrice: action,
  getBuyOrders: action,
  getSellOrders: action,
  getOrdersHistory: action,
  getInOrders: action,
  getChartData: action,
  test: action
})

export default new TradeStore()
