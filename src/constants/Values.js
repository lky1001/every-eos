export const ACCOUNT_NAME_PATTERN = /([a-z1-5]){12,}/
export const API_SERVER_URI = 'http://localhost:4000'
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
export const ORDER_PAGE_LIMIT = 30
export const ORDER_TYPE_BUY = 'BUY'
export const ORDER_TYPE_SELL = 'SELL'
export const ORDER_STATUS_NOT_DEAL = 'NOT DEAL'
export const ORDER_STATUS_PARTIAL_DEALED = 'PARTIAL DEALED'
export const ORDER_STATUS_ALL_DEALED = 'ALL DEALED'
export const ORDER_STATUS_CANCELLED = 'CANCELLED'
export const GET_BALANCE_INTERVAL = 5000
export const GET_OPEN_ORDER_INTERVAL = 5000
export const GET_ORDER_LIST_INTERVAL = 2000
export const GET_ORDER_HISTORY_INTERVAL = 5000
export const GET_CHART_DATA_INTERVAL = 5000
