import { decorate, observable, action } from 'mobx'
import graphql from 'mobx-apollo'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import gql from 'graphql-tag'

const uri = 'http://localhost:4000'
const client = new ApolloClient({
  link: new HttpLink({ uri }),
  cache: new InMemoryCache()
})

const tokenFragment = gql`
  {
    tokens {
      name
      symbol
      market
      created
    }
  }
`

const allTokensQuery = gql`
  {
    allTokens {
      ...token
    }
  }
  ${tokenFragment}
`

class MarketStore {
  tokens = []

  getTokenList = async () => {
    const result = await graphql({ client, query: tokenFragment })
    console.log(JSON.stringify(result.data))
    this.tokens = result.data.tokens
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
