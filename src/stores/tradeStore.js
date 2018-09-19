import { decorate, observable, set, toJS, computed, action } from 'mobx'
import graphql from 'mobx-apollo'
import ApiServerAgent from '../ApiServerAgent'
import { orderQuery, ordersQuery, stackedOrdersQuery } from '../graphql/query/order'
import { cancelOrderMutation } from '../graphql/mutation/order'
import {
  ORDER_PAGE_LIMIT,
  ORDER_TYPE_BUY,
  ORDER_TYPE_SELL,
  ORDER_STATUS_NOT_DEAL,
  ORDER_STATUS_PARTIAL_DEALED,
  ORDER_STATUS_ALL_DEALED,
  ORDER_STATUS_CANCELLED
} from '../constants/Values'

class TradeStore {
  tokenSymbol = ''
  price = 0.0
  amount = 0.0
  chartData = []

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

  openOrders = {
    data: {
      orders: []
    },
    loading: false,
    error: null
  }

  constructor() {
    const initialTokenId = 1

    set(this, {
      get order() {
        return graphql({
          client: ApiServerAgent,
          query: orderQuery
        })
      }
    })

    set(this, {
      get buyOrders() {
        return graphql({
          client: ApiServerAgent,
          query: stackedOrdersQuery,
          variables: {
            token_id: initialTokenId,
            type: ORDER_TYPE_BUY,
            limit: ORDER_PAGE_LIMIT
          }
        })
      }
    })

    set(this, {
      get sellOrders() {
        return graphql({
          client: ApiServerAgent,
          query: stackedOrdersQuery,
          variables: {
            token_id: initialTokenId,
            type: ORDER_TYPE_SELL,
            limit: ORDER_PAGE_LIMIT
          }
        })
      }
    })

    set(this, {
      get ordersHistory() {
        return graphql({
          client: ApiServerAgent,
          query: ordersQuery,
          variables: { account_name: '', status: '["ALL_DEALED", "CANCELLED"]' }
        })
      }
    })

    set(this, {
      get openOrders() {
        return graphql({
          client: ApiServerAgent,
          query: ordersQuery,
          variables: {
            account_name: '',
            status: '["NOT_DEAL", "PARTIAL_DEALED"]'
          }
        })
      }
    })

    this.chartData = observable.box([])
    this.price = observable.box(0.0)
  }

  setTokenSymbol = symbol => {
    this.tokenSymbol = symbol
  }

  setPrice = price => {
    this.price.set(price)
  }

  setWatchPrice = observer => {
    return this.price.observe(observer)
  }

  setAmount = amount => {
    this.amount = amount
  }

  setChartData = async chartData => {
    this.chartData.set(chartData)
  }
  setWatchChartData = observer => {
    this.chartData.observe(observer)
  }

  getBuyOrders = async (token_id, limit) => {
    this.buyOrders = await graphql({
      client: ApiServerAgent,
      query: stackedOrdersQuery,
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
    return (this.buyOrders.data && toJS(this.buyOrders.data.stackedOrders)) || []
  }

  get buyOrdersCount() {
    return this.buyOrders.data.stackedOrders ? this.buyOrders.data.stackedOrders.length : 0
  }

  getSellOrders = async (token_id, limit) => {
    this.sellOrders = await graphql({
      client: ApiServerAgent,
      query: stackedOrdersQuery,
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
    return (this.sellOrders.data && toJS(this.sellOrders.data.stackedOrders)) || []
  }

  get sellOrdersCount() {
    return this.sellOrders.data.stackedOrders ? this.sellOrders.data.stackedOrders.length : 0
  }

  getOrdersHistory = async (account_name, status, limit, page, from, to) => {
    this.ordersHistory = await graphql({
      client: ApiServerAgent,
      query: ordersQuery,
      variables: {
        account_name: account_name,
        status: status,
        limit: limit,
        page: page,
        from: from,
        to: to
      }
    })
  }

  clearOrdersHistory = () => {
    this.ordersHistory.data.orders = []
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

  getOpenOrders = async (account_name, status, limit, page) => {
    this.openOrders = await graphql({
      client: ApiServerAgent,
      query: ordersQuery,
      variables: {
        account_name: account_name,
        status: status,
        limit: limit,
        page: page
      }
    })
  }

  clearOpenOrders = () => {
    this.openOrders.data.orders = []
  }

  get openOrdersError() {
    return (this.openOrders.error && this.openOrders.error.message) || null
  }

  get openOrdersLoading() {
    return this.openOrders.loading
  }

  get openOrdersList() {
    return (this.openOrders.data && toJS(this.openOrders.data.orders)) || []
  }

  get openOrdersCount() {
    return this.openOrders.data.orders ? this.openOrders.data.orders.length : 0
  }

  cancelOrder = async (data, signature) => {
    try {
      return await ApiServerAgent.mutate({
        mutation: cancelOrderMutation,
        variables: { data: data, signature: signature }
      })
    } catch (err) {
      console.error(err.message)
      return false
    }
  }

  getPollingOrder = txid => {
    return graphql({
      client: ApiServerAgent,
      query: orderQuery,
      variables: {
        transaction_id: txid
      }
    })
  }

  getPollingOrderByTxId = txid => {
    if (!txid) return
    let isDone = false
    const pollingId = setInterval(async () => {
      const pollingOrder = await this.getPollingOrder(txid)

      if (!isDone && pollingOrder && pollingOrder.data && pollingOrder.data.order) {
        isDone = true
        clearInterval(pollingId)
        const arrivedOrderByTxId = toJS(pollingOrder.data.order)

        if (
          arrivedOrderByTxId.status === ORDER_STATUS_ALL_DEALED ||
          arrivedOrderByTxId.status === ORDER_STATUS_CANCELLED
        ) {
          this.ordersHistory.data.orders.unshift(arrivedOrderByTxId)
        } else {
          this.openOrders.data.orders.unshift(arrivedOrderByTxId)
        }
      }
    }, 1000)
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
  pollingOrder: observable,
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
  openOrders: observable,
  openOrdersError: computed,
  openOrdersLoading: computed,
  openOrdersList: computed,
  openOrdersCount: computed,
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
  getOpenOrders: action,
  getPollingOrderByTxId: action,
  clearOrdersHistory: action,
  clearOpenOrders: action,
  setChartData: action,
  setWatchChartData: action,
  test: action
})

export default new TradeStore()
