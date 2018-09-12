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

// export const ordersQuery = gql`
//   {
//     orders {
//       ...order
//     }
//   }
//   ${orderFragment}
// `

export const ordersQuery = gql`
  query($token_id: Int, $type: String, $limit: Int!, $status: String, $account_name: String) {
    orders(
      token_id: $token_id
      type: $type
      limit: $limit
      status: $status
      account_name: $account_name
    ) {
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

export const openOrdersQuery = gql`
  query($token_id: Int, $type: String, $limit: Int!, $account_name: String) {
    openOrders(token_id: $token_id, type: $type, limit: $limit, account_name: $account_name) {
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
