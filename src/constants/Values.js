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
