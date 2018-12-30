import gql from 'graphql-tag'

const tokenFragment = gql`
  fragment token on Token {
    id
    name
    symbol
    market
    precision
    contract
    maker_fee
    taker_fee
    last_price
    last_previous_price
    last_day_price
    volume_24h
    high_price_24h
    low_price_24h
  }
`

export const tokensQuery = gql`
  query($from: Date) {
    tokens(from: $from) {
      id
      name
      symbol
      market
      precision
      contract
      maker_fee
      taker_fee
      last_price
      last_previous_price
      last_day_price
      volume_24h
      high_price_24h
      low_price_24h
    }
  }
`

export const findTokenQuery = gql`
  query($symbol: String!, $from: Date) {
    token(symbol: $symbol, from: $from) {
      id
      name
      symbol
      market
      precision
      contract
      maker_fee
      taker_fee
      last_price
      last_previous_price
      last_day_price
      volume_24h
      high_price_24h
      low_price_24h
    }
  }
`
