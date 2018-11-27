import gql from 'graphql-tag'

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
const orderFragment = gql`
  fragment order on Order {
    id
    token_id
    token {
      symbol
      market
    }
    orderDetails {
      ...orderDetail
    }
    type
    token_price
    total_amount
    deal_amount
    total_transfer_fee
    total_trade_fee
    account_name
    transaction_id
    status
    created
  }
  ${orderDetailFragment}
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
  query(
    $token_symbol: String
    $type: String
    $status: String
    $limit: Int
    $page: Int
    $from: Date
    $to: Date
  ) {
    orders(
      token_symbol: $token_symbol
      type: $type
      status: $status
      limit: $limit
      page: $page
      from: $from
      to: $to
    ) {
      orders {
        id
        token_id
        type
        token_price
        total_amount
        deal_amount
        account_name
        status
        created
        updated
        orderDetails {
          ...orderDetail
        }
        token {
          symbol
          market
        }
      }
      totalCount
    }
  }
  ${orderDetailFragment}
`

export const ordersForAccountQuery = gql`
  query(
    $account_name: String!
    $token_symbol: String
    $type: String
    $status: String
    $limit: Int
    $page: Int
    $from: Date
    $to: Date
  ) {
    ordersForAccount(
      account_name: $account_name
      token_symbol: $token_symbol
      type: $type
      status: $status
      limit: $limit
      page: $page
      from: $from
      to: $to
    ) {
      orders {
        id
        token_id
        type
        token_price
        total_amount
        deal_amount
        account_name
        status
        created
        updated
        orderDetails {
          ...orderDetail
        }
        token {
          symbol
          market
        }
      }
      totalCount
    }
  }
  ${orderDetailFragment}
`

export const stackedOrdersQuery = gql`
  query($token_id: Int!, $type: String!, $limit: Int) {
    stackedOrders(token_id: $token_id, type: $type, limit: $limit) {
      token_id
      token_price
      stacked_amount
    }
  }
`

export const latestTradesQuery = gql`
  query($token_id: Int!) {
    latestTrades(token_id: $token_id) {
      transaction_id
      token_price
      amount
      order_type
      created
    }
  }
`
