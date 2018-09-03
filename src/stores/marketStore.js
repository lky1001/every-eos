import { decorate, observable, action } from 'mobx'
import { ApolloClient } from 'apollo-mobx'
import gql from 'graphql-tag'

const client = new ApolloClient({ uri: 'http://localhost:4000' })

const tokenFragment = gql`
  fragment token on Token {
    id
    name
    symbol
    market
    precision
    contrat
    last_price
    volume_24h
    high_price_24h
    low_price_24h
    status
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

  getTokenList = async () => {}

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
}

decorate(MarketStore, {
  tokens: observable,
  getTokenList: action
})

export default new MarketStore()
