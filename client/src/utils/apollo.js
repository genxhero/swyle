import { HttpLink } from 'apollo-link-http';
import { ApolloLink, Observable } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloClient } from 'apollo-client';

const getTokens = async () => {
    const tokens = {
        "X-CSRF-Token": document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content")
    };
    const authToken = await localStorage.getItem("mlToken");
    console.log("AuthToken:", authToken);
    return authToken ? { ...tokens, Authorization: authToken } : tokens;
};
 

const setTokenForOperation = async operation => {
    return operation.setContext({
        headers: {
            // eslint-disable-next-line
            ... await getTokens(),
        }
    });
};

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


const createHttpLink = () => new HttpLink({
    uri: 'http://localhost:3000/graphql',
    credentials: 'include',
})



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





// export const createClient = (cache, requestLink) => {
//     return new ApolloClient({
//         link: ApolloLink.from([
//             createErrorLink(),
//             createLinkWithToken(),
//             createHttpLink(),
//         ]),
//         cache,
//     });
// };


export const createClient = (cache, requestLink) => {
    const client = new ApolloClient({
        link: ApolloLink.from([
            createErrorLink(),
            createLinkWithToken(),
            createHttpLink(),
        ]),
        cache,
    });
    return client;
};

export const createCache = () => {
    const cache = new InMemoryCache();
    if (process.env.NODE_ENV === 'development') {
        window.secretVariableToStoreCache = cache;
    }
    return cache;
};