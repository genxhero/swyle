import React, { useEffect } from 'react';
import ArticleSubscription from './subscriptions/article_show';


const Subscription = ({ subscribeToMore }) => {
    useEffect(() => {
        return subscribeToMore({
            document: ArticleSubscription,
            updateQuery: (prev, { subscriptionData }) => {
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
                debugger;
                
                if (articleUpdated) {
                debugger
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