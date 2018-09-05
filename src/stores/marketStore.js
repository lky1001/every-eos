import { decorate, observable, set, toJS, computed, action } from 'mobx'
import graphql from 'mobx-apollo'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import gql from 'graphql-tag'

const uri = 'http://localhost:4000'
const client = new ApolloClient({
  link: new HttpLink({ uri }),
  cache: new InMemoryCache()
})

const tokenFragment = gql`
  fragment token on Token {
    id
    name
    symbol
    market
    precision
    contract
    last_price
    last_day_price
    volume_24h
    high_price_24h
    low_price_24h
  }
`

const tokensQuery = gql`
  {
    tokens {
      ...token
    }
  }
  ${tokenFragment}
`

class MarketStore {
  constructor() {
    set(this, {
      get tokens() {
        return graphql({ client, query: tokensQuery })
      }
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

  cancelOrder = async (accountName, id) => {}

  getChart = async (tokenId, group) => {}
}

decorate(MarketStore, {
  tokens: observable,
  error: computed,
  loading: computed,
  tokenList: computed,
  count: computed
})

export default new MarketStore()
