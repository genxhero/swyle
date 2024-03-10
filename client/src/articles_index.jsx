import React from 'react';
import { useQuery } from '@apollo/client';
import Subscription from './articles_subscription';
import ArticleCard from './article_card';
import articles from './queries/articles'; 

const ArticlesIndex = (props) => {
  console.log("Preparing to load data....");
  const { loading, error, data, subscribeToMore } = useQuery(articles, {
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return <div className={`loading-div loading-div-${props.colorScheme}`}><img className="loading-img" alt="load" src="https://i.gifer.com/origin/4d/4dc11d17f5292fd463a60aa2bbb41f6a_w200.gif"/></div>;
  if (error) return <p>Error :(</p>;

  const articlesData = data.articles; // Accessing the articles data directly

  return (
    <div className={`article-index-page article-index-page-${props.colorScheme}`}>
      <h1>Newest Articles</h1>
      {articlesData.map((article) => (
        <ArticleCard key={article.id} article={article} date={Date.now()} colorScheme={props.colorScheme} />       
      ))}
      <Subscription subscribeToMore={subscribeToMore} />
    </div>
  );
}

export default ArticlesIndex;

/**
import React from 'react';
import articles from './queries/articles';
import { Query } from "react-apollo";
import Subscription from './articles_subscription';
import ArticleCard from './article_card';

const ArticlesIndex = (props) => {
        const date = Date.now();
        return (
            <Query query={articles} fetchPolicy="cache-and-network">
                {({ loading, error, data, subscribeToMore }) => {
                    
                    if (loading) return <div className={`loading-div loading-div-${props.colorScheme}`}><img className="loading-img" alt="load" src="https://i.gifer.com/origin/4d/4dc11d17f5292fd463a60aa2bbb41f6a_w200.gif"/></div>;
                    if (error) return <p>Error :(</p>;
                    const articles = data.articles;
                    const colorScheme = props.colorScheme || "standard"
                    return (
                        <div className={`article-index-page article-index-page-${colorScheme}`}>
                            <h1>Newest Articles</h1>
                            {articles.map((article) => (
                                <ArticleCard article={article} date={date} colorScheme={colorScheme} />       
                            ))}
                            <Subscription subscribeToMore={subscribeToMore} />
                        </div>
                    )
                }}
            </Query>
        );
}

export default ArticlesIndex; */
