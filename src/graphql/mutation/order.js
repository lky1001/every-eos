import gql from 'graphql-tag'

export const cancelOrderMutation = gql`
  mutation($account_name: String!, $signature: String!, $order_id: Int!) {
    cancelOrder(account_name: $account_name, signature: $signature, order_id: $order_id)
  }
`
