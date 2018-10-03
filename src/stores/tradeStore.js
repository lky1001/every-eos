import { decorate, observable, set, toJS, computed, action } from 'mobx'
import graphql from 'mobx-apollo'
import ApiServerAgent from '../ApiServerAgent'
import { format, subDays } from 'date-fns'
import { orderQuery, ordersForAccountQuery, stackedOrdersQuery } from '../graphql/query/order'
import { getTypeFilter, typeOptions, pageSizeOptions } from '../utils/OrderSearchFilter'
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
      ordersHistory: {
        orders: [],
        totalCount: 0
      }
    },
    loading: false,
    error: null
  }

  openOrders = {
    data: {
      openOrders: {
        orders: [],
        totalCount: 0
      }
    },
    loading: false,
    error: null
  }

  chartDatas = {
    data: {
      datas: []
    },
    loading: false,
    error: null
  }

  constructor() {
    const today = new Date()
    const initialTokenId = 1
    this.orderHistoryPage = 1
    this.orderHistoryFrom = subDays(today, 30)
    this.orderHistoryTo = today
    this.selectedOrderHistoryPageSize = pageSizeOptions[0]
    this.selectedOrderHistoryType = typeOptions[0]

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
      get chartDatas() {}
    })

    set(this, {
      get ordersHistory() {}
    })

    set(this, {
      get openOrders() {}
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

  setSelectedOrderHistoryPageSize = newValue => {
    this.selectedOrderHistoryPageSize = newValue
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

  getOrdersHistory = async (account_name, token_symbol, type, status, limit, page, from, to) => {
    this.ordersHistory = await graphql({
      client: ApiServerAgent,
      query: ordersForAccountQuery,
      variables: {
        account_name: account_name,
        token_symbol: token_symbol,
        type: type,
        status: status,
        limit: limit,
        page: page,
        from: from,
        to: to
      }
    })
  }

  setOrdersHistoryPage = async (account_name, page) => {
    await this.getOrdersHistory(
      account_name,
      this.tokenSymbol,
      getTypeFilter(this.selectedOrderHistoryType),
      JSON.stringify([ORDER_STATUS_ALL_DEALED, ORDER_STATUS_CANCELLED]),
      this.selectedOrderHistoryPageSize.value,
      page,
      this.orderHistoryFrom,
      this.orderHistoryTo
    )
    this.orderHistoryPage = page
  }

  clearOrdersHistory = () => {
    if (
      this.ordersHistory &&
      this.ordersHistory.data &&
      this.ordersHistory.data.ordersForAccount &&
      this.ordersHistory.data.ordersForAccount.orders
    ) {
      this.ordersHistory.data.ordersForAccount.orders = []
      this.ordersHistory.data.ordersForAccount.totalCount = 0
    }
  }

  get ordersHistoryError() {
    return (
      (this.ordersHistory && this.ordersHistory.error && this.ordersHistory.error.message) || null
    )
  }

  get ordersHistoryLoading() {
    return this.ordersHistory ? this.ordersHistory.loading : false
  }

  get ordersHistoryList() {
    return (
      (this.ordersHistory &&
        this.ordersHistory.data &&
        this.ordersHistory.data.ordersForAccount &&
        this.ordersHistory.data.ordersForAccount.orders &&
        toJS(this.ordersHistory.data.ordersForAccount.orders)) ||
      []
    )
  }

  get ordersHistoryTotalCount() {
    return this.ordersHistory && this.ordersHistory.data && this.ordersHistory.data.ordersForAccount
      ? this.ordersHistory.data.ordersForAccount.totalCount
      : 0
  }

  get ordersHistoryCount() {
    return this.ordersHistory &&
      this.ordersHistory.data &&
      this.ordersHistory.data.ordersForAccount &&
      this.ordersHistory.data.ordersForAccount.orders
      ? this.ordersHistory.data.ordersForAccount.orders.length
      : 0
  }

  getOpenOrders = async (account_name, status, limit, page) => {
    this.openOrders = await graphql({
      client: ApiServerAgent,
      query: ordersForAccountQuery,
      variables: {
        account_name: account_name,
        status: status,
        limit: limit,
        page: page
      }
    })
  }

  clearOpenOrders = () => {
    if (
      this.openOrders &&
      this.openOrders.data &&
      this.openOrders.data.ordersForAccount &&
      this.openOrders.data.ordersForAccount.orders
    ) {
      this.openOrders.data.ordersForAccount.orders = []
      this.openOrders.data.ordersForAccount.totalCount = 0
    }
  }

  get openOrdersError() {
    return (this.openOrders && this.openOrders.error && this.openOrders.error.message) || null
  }

  get openOrdersLoading() {
    return this.openOrders ? this.openOrders.loading : false
  }

  get openOrdersList() {
    return (
      (this.openOrders &&
        this.openOrders.data &&
        this.openOrders.data.ordersForAccount &&
        this.openOrders.data.ordersForAccount.orders &&
        toJS(this.openOrders.data.ordersForAccount.orders)) ||
      []
    )
  }

  get openOrdersCount() {
    return this.openOrders &&
      this.openOrders.data &&
      this.openOrders.data.ordersForAccount &&
      this.openOrders.data.ordersForAccount.orders
      ? this.openOrders.data.ordersForAccount.orders.length
      : 0
  }

  get openOrdersTotalCount() {
    return this.openOrders && this.openOrders.data && this.openOrders.data.ordersForAccount
      ? this.openOrders.data.ordersForAccount.totalCount
      : 0
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

  getPollingOrderByTxId = (txid, account_name) => {
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
          this.setOrdersHistoryPage(account_name, 1)
        } else {
          this.getOpenOrders(
            account_name,
            JSON.stringify([ORDER_STATUS_NOT_DEAL, ORDER_STATUS_PARTIAL_DEALED])
          )
        }
      }
    }, 1000)
  }
}

decorate(TradeStore, {
  orderHistoryPage: observable,
  orderHistoryFrom: observable,
  orderHistoryTo: observable,
  selectedOrderHistoryPageSize: observable,
  selectedOrderHistoryType: observable,
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
  ordersHistoryTotalCount: computed,
  openOrders: observable,
  openOrdersError: computed,
  openOrdersLoading: computed,
  openOrdersList: computed,
  openOrdersCount: computed,
  openOrdersTotalCount: computed,
  tokenSymbol: observable,
  price: observable,
  amount: observable,
  chartData: observable,
  setTokenSymbol: action,
  setPrice: action,
  setAmount: action,
  setSelectedOrderHistoryPageSize: action,
  setWatchPrice: action,
  getBuyOrders: action,
  getSellOrders: action,
  getOrdersHistory: action,
  setOrdersHistoryPage: action,
  getOpenOrders: action,
  getPollingOrderByTxId: action,
  clearOrdersHistory: action,
  clearOpenOrders: action,
  setChartData: action,
  setWatchChartData: action,
  test: action
})

export default new TradeStore()
