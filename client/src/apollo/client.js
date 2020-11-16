import fetch from 'cross-fetch';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://ujeibgxzejdmrbyaxp5rasj3ii.appsync-api.us-east-2.amazonaws.com/graphql',
    headers:{
      "x-api-key": "da2-l5f7umxdhvggfhsutzjs7zf34e"
    },
    fetch
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          _ref: {
            merge(existing = [], incoming) {
              return { ...existing, ...incoming }
            }
          }
        }
      }
    }
  })
});