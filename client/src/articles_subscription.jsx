/* eslint-disable react-hooks/exhaustive-deps, no-unused-vars */
import React, { useEffect } from 'react';
import ArticleSubscription from './subscriptions/article_index';

/**
 * Subscription function for the articles index page; updates the index when a new article is created on a different client.
 */

const Subscription = ({ subscribeToMore }) => {
  useEffect(() => {
    return subscribeToMore({
      document: ArticleSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { articleAdded } = subscriptionData.data;
        console.log("Added:", articleAdded)
        if (articleAdded) {
          const alreadyInList = prev.articles.find(e => e.id === articleAdded.id);
          if (alreadyInList) {
            return prev;
          }
          return { articles: [articleAdded].concat(prev.articles) };
        }
        const {articleLiked} = subscriptionData.data;

        if(articleLiked) {
          return {
            articles: prev.articles.map(el =>
              el.id === articleLiked.id ? { ...el, ...articleLiked } : el)
          }
        }
        const {articleUnliked} = subscriptionData.data
        if (articleUnliked) {
          return {
            articles: prev.articles.map(el =>
              el.id === articleUnliked.id ? { ...el, ...articleUnliked } : el)
          }
        }

        const {articleUpdated} = subscriptionData.data;
        
        if (articleUpdated) {
          
          return {
            articles: prev.articles.map(el =>
              el.id === articleUpdated.id ? { ...el, ...articleUpdated } : el)
          }
        }

        return prev;
      },
    });
  }, []);
  return null;
};

export default Subscription;