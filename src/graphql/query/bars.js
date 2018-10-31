import gql from 'graphql-tag'

const barFragment = gql`
  fragment bar on Bar {
    id
    token_id
    start_time
    opening_price
    close_price
    high_price
    low_price
    volume
    created
  }
`

export const barChartQuery = gql`
  query($statistic_type: String!, $token_id: Int!, $resolution: Int!, $from: Date!, $to: Date!) {
    bars(
      statistic_type: $statistic_type
      token_id: $token_id
      resolution: $resolution
      from: $from
      to: $to
    ) {
      bars {
        id
        token_id
        start_time
        opening_price
        close_price
        high_price
        low_price
        volume
      }
    }
  }
`
