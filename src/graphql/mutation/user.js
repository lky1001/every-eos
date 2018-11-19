import gql from 'graphql-tag'

export const loginUserMutation = gql`
  mutation($account: String!) {
    loginUser(account_name: $account)
  }
`
