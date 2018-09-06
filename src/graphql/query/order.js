import gql from 'graphql-tag'

const orderFragment = gql`
  fragment order on Order {
    id
    token_id
    type
    token_price
    amount
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
  query($token_id: Int!) {
    orders(token_id: $token_id) {
      id
      token_id
      type
      token_price
      amount
      account_name
      status
      created
    }
  }
`
