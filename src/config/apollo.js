import {
  ApolloClient,
  /* createHttpLink, */ InMemoryCache,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

const httpLink = createUploadLink({
	uri: 'https://cafi-punto-venta.herokuapp.com/',
  // uri: 'http://localhost:4000/',
});

const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache({
    addTypename: false,
  }),
  link: httpLink,
});

export default client;
