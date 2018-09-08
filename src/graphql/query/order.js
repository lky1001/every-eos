import gql from 'graphql-tag'

const orderFragment = gql`
  fragment order on Order {
    id
    token_id
    type
    token_price
    total_amount
    deal_amount
    account_name
    status
    created
  }
`

export const ordersQuery = gql`
  {
    orders {
      ...order
    }
  }
  ${orderFragment}
`

export const ordersByTokenIdQuery = gql`
  query($token_id: Int!, $type: String, $limit: Int!) {
    orders(token_id: $token_id, type: $type, limit: $limit) {
      id
      token_id
      type
      token_price
      total_amount
      deal_amount
      account_name
      status
      created
    }
  }
`

export const ordersByAccountNameQuery = gql`
  query($account_name: String!) {
    orders(account_name: $account_name) {
      id
      token_id
      type
      token_price
      total_amount
      deal_amount
      account_name
      status
      created
    }
  }
`
