export const ACCOUNT_NAME_PATTERN = /([a-z1-5]){12,}/
// export const API_SERVER_URI = 'http://192.168.2.57:4000'

export const API_SERVER_GRAPHQL_URI = 'https://graph.everyeos.com/graphql'
export const API_SERVER_REST_URI = 'https://graph.everyeos.com'
// export const API_SERVER_GRAPHQL_URI = 'http://localhost:4000/graphql'
// export const API_SERVER_REST_URI = 'http://localhost:4000'

export const actionPerPage = 1000

const protocol = 'https'
const host = 'user-api.eoseoul.io'
const port = 443
const chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'

export const requiredFields = {
  accounts: [
    {
      blockchain: 'eos',
      host: host,
      port: port,
      chainId: chainId
    }
  ]
}

export const NETWORK = {
  blockchain: 'eos',
  protocol: protocol,
  host: host,
  port: port,
  chainId: chainId
}

export const CONFIG = {
  broadcast: true,
  sign: true,
  chainId: chainId
}

export const supportLanguage = ['ko-KR', 'en-US']

export const EOS_TOKEN = {
  symbol: 'EOS',
  precision: 4,
  contract: 'eosio.token'
}

export const SCATTER_ERROR_REJECT_TRANSACTION_BY_USER = 402
export const SCATTER_ERROR_LOCKED = 423
export const EOSIO_SERVER_ERROR = 500
export const EOSIO_SERVER_ERROR_CPU_LIMIT = 3080004

export const ORDER_PAGE_LIMIT = 10

export const ORDER_TYPE_BUY = 'BUY'
export const ORDER_TYPE_SELL = 'SELL'
export const ORDER_STATUS_NOT_DEAL = 'NOT_DEAL'
export const ORDER_STATUS_PARTIAL_DEALED = 'PARTIAL_DEALED'
export const ORDER_STATUS_ALL_DEALED = 'ALL_DEALED'
export const ORDER_STATUS_CANCELLED = 'CANCELLED'
export const ORDER_DETAIL_DEAL_STATUS_DEAL = 'DEAL'
export const ORDER_DETAIL_DEAL_STATUS_CANCELLED = 'CANCELLED'
export const ORDER_DETAIL_TRANSFER_STATUS_WAIT = 'WAIT'
export const ORDER_DETAIL_TRANSFER_STATUS_DONE = 'DONE'
export const PAGE_SIZE_TEN = 10
export const PAGE_SIZE_TWENTY = 20
export const PAGE_SIZE_THIRTY = 30
export const PAGE_SIZE_FIFTY = 50
export const GET_BALANCE_INTERVAL = 5000
export const GET_OPEN_ORDER_INTERVAL = 5000
export const GET_ORDER_LIST_INTERVAL = 2000
export const GET_ORDER_HISTORY_INTERVAL = 5000
export const GET_CHART_DATA_INTERVAL = 5000
export const GET_LAST_TRADE_INTERVAL = 5000

export const SELECT_ORDER_TYPE_ALL = 'All'
export const SELECT_ORDER_TYPE_BUY = 'Buy'
export const SELECT_ORDER_TYPE_SELL = 'Sell'

export const SELECT_ORDER_STATUS_ALL = 'All'
export const SELECT_ORDER_STATUS_IN_PROGRESS = 'In progress'
export const SELECT_ORDER_STATUS_COMPLETED_OR_CANCELLED = 'Completed or Cancelled'
export const SELECT_ORDER_STATUS_COMPLETED = 'Completed'
export const SELECT_ORDER_STATUS_CANCELLED = 'Cancelled'
export const ORDER_DATE_FORMAT = 'MM-DD-YYYY HH:mm:ss'
