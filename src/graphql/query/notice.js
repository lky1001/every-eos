import gql from 'graphql-tag'

const noticeFragment = gql`
  fragment notice on Notice {
    id
    title
    description
    created
    updated
    deleted
  }
`

export const noticesQuery = gql`
  query {
    notices {
      id
      title
      description
      created
      updated
      deleted
    }
  }
`
