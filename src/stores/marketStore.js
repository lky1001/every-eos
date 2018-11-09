import { decorate, observable, set, toJS, computed, action } from 'mobx'
import graphql from 'mobx-apollo'
import ApiServerAgent from '../ApiServerAgent'
import { tokensQuery, findTokenQuery } from '../graphql/query/token'

class MarketStore {
  token = {
    data: {
      token: null
    },
    loading: false,
    error: null
  }
  tokens = {
    data: {
      tokens: []
    },
    loading: false,
    error: null
  }

  constructor() {
    set(this, {
      get tokens() {
        return graphql({ client: ApiServerAgent, query: tokensQuery })
      }
    })
  }

  getTokens = async () => {
    console.log('겟토큰 왜옴?')
    this.tokens = await graphql({ client: ApiServerAgent, query: tokensQuery })
  }

  getTokenBySymbol = async symbol => {
    this.token = await graphql({
      client: ApiServerAgent,
      query: findTokenQuery,
      variables: { symbol: symbol }
    })
  }

  get error() {
    return (this.tokens.error && this.tokens.error.message) || null
  }

  get loading() {
    return this.tokens.loading
  }

  get tokenList() {
    return (this.tokens.data && toJS(this.tokens.data.tokens)) || []
  }

  get count() {
    return this.tokens.data.tokens ? this.tokens.data.tokens.length : 0
  }

  /**
   * symbol : IQ
   * market : IQ_EOS
   */
  getTokenInfo = async (symbol, market) => {
    // last price
    // 24H change
    // 24H High
    // 24H Low
    // 24H Volume
  }

  getCurrentOrder = async accountName => {}

  getOrderHistory = async accountName => {}

  getChart = async (tokenId, group) => {}
}

decorate(MarketStore, {
  tokens: observable,
  token: observable,
  error: computed,
  loading: computed,
  tokenList: computed,
  count: computed,
  getTokensById: action,
  getTokenBySymbol: action
})

export default new MarketStore()
