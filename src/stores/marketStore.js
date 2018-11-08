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

  updateFavoriteForToken = symbol => {
    const filteredToken = this.tokens.data.tokens.filter(t => t.symbol === symbol)

    const targetToken = filteredToken.length > 0 ? filteredToken[0] : null

    if (targetToken) {
      const updatedToken = { ...targetToken, favorite: true }

      console.log('업데이트 됨', updatedToken)
      this.tokens.data.tokens.splice(this.tokens.data.tokens.indexOf(targetToken), 1, updatedToken)
    }
  }
}

decorate(MarketStore, {
  tokens: observable,
  token: observable,
  error: computed,
  loading: computed,
  tokenList: computed,
  count: computed,
  getTokensById: action,
  getTokenBySymbol: action,
  updateFavoriteForToken: action
})

export default new MarketStore()
