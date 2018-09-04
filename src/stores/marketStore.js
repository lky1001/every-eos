import { decorate, observable, set, toJS, action } from 'mobx'
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
    symbol
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
  tokens = []

  constructor() {
    set(this, {
      get tokens() {
        return graphql({ client, query: tokensQuery })
      },
      get error() {
        return (this.tokens.error && this.tokens.error.message) || null
      },
      get loading() {
        return this.tokens.loading
      },
      get currenttokens() {
        return (this.tokens.data && toJS(this.tokens.data.tokens)) || []
      },
      get count() {
        return this.tokens.length
      }
    })
  }

  getTokenList = async () => {
    // const result = await graphql({ client, query: tokenFragment })
    // console.log(JSON.stringify(result.data))
    // this.tokens = result.data.tokens
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
  getTokenList: action
})

export default new MarketStore()
