import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import { getStateLink } from './state';

// Cache
const cache = new InMemoryCache();

// Get the state link
const stateLink = getStateLink(cache);

// Create an http link:
const httpLink = new HttpLink({
  credentials: 'include',
  fetchOptions: {
    mode: 'cors',
  },
  uri: 'http://localhost:5000/graphql',
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  options: {
    reconnect: true
  },
  uri: `ws://localhost:5000/subscriptions`,
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const mainDefinition = getMainDefinition(query);
    const kind = mainDefinition.kind;
    // @ts-ignore: operation not yet added to definition file
    const operation: string = mainDefinition.operation;
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          /* tslint:disable no-console */
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
          /* tslint:enable no-console */
        );
      }
      if (networkError) {
          /* tslint:disable no-console */
          console.log(`[Network error]: ${networkError}`);
          /* tslint:enable no-console */
      }
    }),
    stateLink,
    link,
  ]),
});

client.initQueryManager();
export default client;
