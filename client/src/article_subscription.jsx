/* eslint-disable react-hooks/exhaustive-deps, no-unused-vars */
/**
 * Subscription component for the ArticleShow page.
 */

import React, { useEffect } from 'react';
import ArticleSubscription from './subscriptions/article_show';


const Subscription = ({ subscribeToMore }) => {
    useEffect(() => {
        console.log("Using Effect");
        return subscribeToMore({
            document: ArticleSubscription,
            updateQuery: (prev, { subscriptionData }) => {
                console.log("Before subscription data's existence is being checked")
                if (!subscriptionData.data) {
                    console.log("NO SUBSCRIPTION DATA")
                    return prev;
                }

                console.log("THE DATA:", subscriptionData)
               
   

                const { articleUpdated } = subscriptionData.data;
                if (articleUpdated) {
                    return {
                        article: articleUpdated
                    }
                }

                return prev;
            },
        });
    }, []);
    return null;
};

export default Subscription;