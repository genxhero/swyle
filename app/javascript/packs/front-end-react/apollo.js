import ApolloClient from "apollo-boost";
import gql from "graphql-tag";



export const client = new ApolloClient({
    uri: "/graphql",
})