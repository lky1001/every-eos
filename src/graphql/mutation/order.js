import gql from 'graphql-tag'

export const cancelOrderMutation = gql`
  mutation($account_name: String!, $signature: String!) {
    cancelOrder(account_name: $account_name, signature: $signature)
  }
`
