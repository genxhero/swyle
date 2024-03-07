import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider,  } from '@apollo/client';
import { createClient } from './utils/apollo';

/**
 * Does what you'd expect; loads app into the root element
 */

const client = createClient();

ReactDOM.render(
                    <ApolloProvider client={client}>
                        <App />
                    </ApolloProvider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
