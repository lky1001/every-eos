import gql from 'graphql-tag'

const orderFragment = gql`
  fragment order on Order {
    id
    token_id
    type
    token_price
    total_amount
    deal_amount
    # total_transfer_fee
    # total_trade_fee
    account_name
    transaction_id
    status
    created
  }
`

const orderDetailFragment = gql`
  fragment orderDetail on OrderDetail {
    id
    order_id
    relation_order_id
    contract
    token_price
    amount
    transfer_fee
    trade_fee
    account_name
    transaction_id
    deal_status
    transfer_status
    created
    deleted
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

export const orderQuery = gql`
  query($id: Int, $transaction_id: String) {
    order(id: $id, transaction_id: $transaction_id) {
      ...order
    }
  }
  ${orderFragment}
`

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
      orderDetails {
        ...orderDetail
      }
    }
  }
  ${orderDetailFragment}
`
