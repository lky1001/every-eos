import gql from 'graphql-tag'

export const cancelOrderMutation = gql`
  mutation($data: String!, $signature: String!) {
    cancelOrder(data: $data, signature: $signature)
  }
`
