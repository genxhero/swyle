/* eslint-disable react-hooks/exhaustive-deps, no-unused-vars */
/**
 * Subscription component for the ArticleShow page.
 */

import React, { useEffect } from 'react';
import ArticleSubscription from './subscriptions/article_show';


const Subscription = ({ subscribeToMore }) => {
    useEffect(() => {
        return subscribeToMore({
            document: ArticleSubscription,
            updateQuery: (prev, { subscriptionData }) => {
                console.log("Sub Data:", subscriptionData);
                if (!subscriptionData.data) return prev;
               
                const { articleLiked } = subscriptionData.data;

                if (articleLiked) {
                    return {
                        article: articleLiked
                    }
                }
                const { articleUnliked } = subscriptionData.data
                if (articleUnliked) {
                    return {
                        article: articleUnliked
                    }
                }

                const { articleUpdated } = subscriptionData.data;
                
                if (articleUpdated) {
                    console.log("Updated Article:", articleUpdated)
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