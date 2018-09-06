import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset'
import { API_SERVER_URI } from './constants/Values'

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  }
}

const ApiServerAgent = new ApolloClient({
  link: new HttpLink({ uri: API_SERVER_URI }),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions
})

export default ApiServerAgent
