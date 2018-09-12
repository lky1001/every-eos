import gql from 'graphql-tag'

const tokenFragment = gql`
  fragment token on Token {
    id
    name
    symbol
    market
    precision
    contract
    last_price
    last_previous_price
    last_day_price
    volume_24h
    high_price_24h
    low_price_24h
  }
`

export const tokensQuery = gql`
  {
    tokens {
      ...token
    }
  }
  ${tokenFragment}
`

export const findTokenQuery = gql`
  query($symbol: String!) {
    token(symbol: $symbol) {
      id
      name
      symbol
      market
      precision
      contract
      last_price
      last_previous_price
      last_day_price
      volume_24h
      high_price_24h
      low_price_24h
    }
  }
`
