import { HttpLink } from 'apollo-link-http';
import { ApolloLink, Observable } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloClient } from 'apollo-client';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import introspectionQueryResultData from './fragmentTypes.json';
import ActionCable from 'actioncable';
import ActionCableLink from 'graphql-ruby-client/subscriptions/ActionCableLink';

/**
 * This is the websockets URL
 */

const getCableUrl =  () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // const protocol = 'wss:';
    const host = window.location.hostname;
    const port = process.env.CABLE_PORT || '3000';
    const authToken =  localStorage.getItem('mlToken') || 'loggedouttoken';
    if (process.env.NODE_ENV === 'development') {
        // console.log(`${protocol}//${host}:${port}/cable?token=${authToken}`)
        console.log("Cable Url:", `${protocol}//${host}:${port}/cable?token=${authToken}`)
        return `${protocol}//${host}:${port}/cable?token=${authToken}`;
    } else {
        console.log("Cable Url:", `${protocol}//swyler.onrender.com//cable?token=${authToken}`)
        return `${protocol}//swyler.onrender.com//cable?token=${authToken}`;
    }
};

/**
 * Used in creating a link to Action Cable on the Rails API
 */

const createActionCableLink = () => {
    const cable = ActionCable.createConsumer(getCableUrl());
    return new ActionCableLink({ cable });
};

const hasSubscriptionOperation = ({ query: { definitions } }) =>
    definitions.some(
        ({ kind, operation }) =>
            kind === 'OperationDefinition' && operation === 'subscription'
    );

/**
 * Grabs tokens from the document, used solely for websockets and not authorization
 */
const getTokens = async () => {
    const tokens = {
        "X-CSRF-Token": document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content")
    };
    const authToken = await localStorage.getItem("mlToken");
    
    return authToken ? { ...tokens, Authorization: authToken } : tokens;
};
 
/**
 * Asynchronously set the tokens that will appear in the wss headers
 */
const setTokenForOperation = async operation => {
    return operation.setContext({
        headers: {
            // eslint-disable-next-line
            ... await getTokens(),
        }
    });
};

/**
 * Create the apollo link
 */
const createLinkWithToken = () =>
    new ApolloLink(
        (operation, forward) =>
            new Observable(observer => {
                let handle;
                Promise.resolve(operation)
                    .then(setTokenForOperation)
                    .then(() => {
                        handle = forward(operation).subscribe({
                            next: observer.next.bind(observer),
                            error: observer.error.bind(observer),
                            complete: observer.complete.bind(observer),
                        });
                    })
                    .catch(observer.error.bind(observer));
                return () => {
                    if (handle) handle.unsubscribe();
                };
            })
    );


const createHttpLink = () => {
  return new HttpLink({
    uri: `/graphql`,
    credentials: "include"
  });
};


const logError = (error) => console.error(error);
const createErrorLink = () => onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {

        logError('GraphQL - Error', {
            errors: graphQLErrors,
            operationName: operation.operationName,
            variables: operation.variables,
        });
    }
    if (networkError) {
        logError('GraphQL - NetworkError', networkError);
    }
})



export const createClient = (cache, requestLink) => {
    const client = new ApolloClient({
        link: ApolloLink.from([
            createErrorLink(),
            createLinkWithToken(),
            ApolloLink.split(
                hasSubscriptionOperation,
                createActionCableLink(),
                createHttpLink(),
            )
            // createHttpLink(),
        ]),
        cache,
    });
    return client;
};

export const createCache = () => {
    const fragmentMatcher = new IntrospectionFragmentMatcher({
        introspectionQueryResultData
    });
    const cache = new InMemoryCache({fragmentMatcher});
    if (process.env.NODE_ENV === 'development') {
        window.secretVariableToStoreCache = cache;
    }
    return cache;
};
