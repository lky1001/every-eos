import { decorate, observable, set, toJS, computed, action } from 'mobx'
import graphql from 'mobx-apollo'
import ApiServerAgent from '../ApiServerAgent'
import { format, subDays, addDays } from 'date-fns'
import {
  orderQuery,
  ordersForAccountQuery,
  stackedOrdersQuery,
  latestTradesQuery
} from '../graphql/query/order'

import { barChartQuery } from '../graphql/query/bars'
import {
  getTypeFilter,
  getStatusFilter,
  typeOptions,
  pageSizeOptions,
  statusOptions
} from '../utils/OrderSearchFilter'
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
  qty = 0.0
  amount = 0.0

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
      chartDatas: []
    },
    loading: false,
    error: null
  }

  latestTrades = {
    data: {
      latestTrades: []
    },
    loading: true,
    error: null
  }

  constructor(rootStore) {
    this.root = rootStore
    const initialTokenId = 1
    this.initOrdersHistoryFilter()

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

    this.price = observable.box(0.0)
    this.qty = observable.box(0.0)
  }

  initOrdersHistoryFilter = () => {
    const today = new Date()
    this.tokenSymbolForSearch = ''
    this.ordersHistoryPage = 1
    this.ordersHistoryFrom = subDays(today, 30)
    this.ordersHistoryTo = addDays(today, 1)
    this.ordersHistoryPageSize = pageSizeOptions[0]
    this.ordersHistoryType = typeOptions[0]
    this.ordersHistoryStatus = statusOptions[0]
  }

  initExchangeOrdersHistoryFilter = () => {
    this.initOrdersHistoryFilter()
    this.ordersHistoryStatus = statusOptions[2]
  }

  setTokenSymbol = symbol => {
    this.tokenSymbol = symbol
  }

  setTokenSymbolForSearch = symbol => {
    this.tokenSymbolForSearch = symbol
  }

  setPrice = price => {
    this.price.set(price)
  }

  setQty = qty => {
    this.qty.set(qty)
  }

  setWatchPrice = observer => {
    return this.price.observe(observer)
  }

  setWatchQty = observer => {
    return this.qty.observe(observer)
  }

  setAmount = amount => {
    this.amount = amount
  }

  setOrdersHistoryPageSize = newPageSize => {
    this.ordersHistoryPageSize = newPageSize
  }

  setOrdersHistoryType = newType => {
    this.ordersHistoryType = newType
  }

  setOrdersHistoryStatus = newStatus => {
    this.ordersHistoryStatus = newStatus
  }

  setOrdersHistoryFrom = newFrom => {
    this.ordersHistoryFrom = newFrom
  }

  setOrdersHistoryTo = newTo => {
    this.ordersHistoryTo = newTo
  }

  getChartDatas = async (statistic_type, token_id, resolution, from, to) => {
    this.chartDatas = await graphql({
      client: ApiServerAgent,
      query: barChartQuery,
      variables: {
        statistic_type: statistic_type,
        token_id: token_id,
        resolution: resolution,
        from: from,
        to: to
      }
    })
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

  getOrdersHistory = async account_name => {
    if (account_name) {
      this.ordersHistory = await graphql({
        client: ApiServerAgent,
        query: ordersForAccountQuery,
        variables: {
          account_name: account_name,
          token_symbol: this.tokenSymbolForSearch,
          type: getTypeFilter(this.ordersHistoryType),
          status: getStatusFilter(this.ordersHistoryStatus),
          limit: this.ordersHistoryPageSize.value,
          page: this.ordersHistoryPage,
          from: this.ordersHistoryFrom,
          to: this.ordersHistoryTo
        }
      })
    }
  }

  setOrdersHistoryPage = async page => {
    this.ordersHistoryPage = page
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

  getlatestTrades = async tokenId => {
    this.latestTrades = await graphql({
      client: ApiServerAgent,
      query: latestTradesQuery,
      variables: { token_id: tokenId }
    })
  }

  get latestTradesError() {
    return (this.latestTrades && this.latestTrades.error && this.latestTrades.error.message) || null
  }

  get latestTradesLoading() {
    return this.latestTrades ? this.latestTrades.loading : false
  }

  get latestTradesList() {
    return (
      (this.latestTrades && this.latestTrades.data && toJS(this.latestTrades.data.latestTrades)) ||
      []
    )
  }
}

decorate(TradeStore, {
  ordersHistoryPage: observable,
  ordersHistoryFrom: observable,
  ordersHistoryTo: observable,
  ordersHistoryPageSize: observable,
  ordersHistoryType: observable,
  ordersHistoryStatus: observable,
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
  latestTrades: observable,
  latestTradesError: computed,
  latestTradesLoading: computed,
  latestTradesList: computed,
  tokenSymbol: observable,
  tokenSymbolForSearch: observable,
  price: observable,
  amount: observable,
  chartDatas: observable,
  lastOrders: observable,
  setTokenSymbol: action,
  setTokenSymbolForSearch: action,
  setPrice: action,
  setAmount: action,
  setOrdersHistoryPageSize: action,
  setOrdersHistoryType: action,
  setOrdersHistoryStatus: action,
  setOrdersHistoryFrom: action,
  setOrdersHistoryTo: action,
  setWatchPrice: action,
  getBuyOrders: action,
  getSellOrders: action,
  getOrdersHistory: action,
  setOrdersHistoryPage: action,
  getOpenOrders: action,
  clearOrdersHistory: action,
  clearOpenOrders: action,
  getChartDatas: action,
  getLastTrades: action,
  test: action,
  initOrdersHistoryFilter: action,
  initExchangeOrdersHistoryFilter: action
})

export default TradeStore
