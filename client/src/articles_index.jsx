import React from 'react';
import articles from './queries/articles';
import { Query } from "react-apollo";
import {Link} from 'react-router-dom';
// import ArticleTags from './article_tags';
import Subscription from './articles_subscription';
import ArticleCard from './article_card';

/**
 * Displays all articles, newest first.
 * Uses a Subscription component that keeps the front-end updated live.
 * 
 * TODOS
 *  Create a ArticleCard component
 */

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
                                <ArticleCard article={article} date={data} colorScheme={colorScheme} />       
                            ))}
                            <Subscription subscribeToMore={subscribeToMore} />
                        </div>
                    )
                }}
            </Query>
        );
}

export default ArticlesIndex;

//                                     

/**   <div className={`article-index-card ${colorScheme}`} key={`${article.id}${article.title}${date}`}>
                                  <Link className={`article-index-show-link ${colorScheme}`} to={`/articles/${article.id}`}>
                                     <h2 className="article-index-title">{article.title}</h2>
                                     <h3 className="article-index-subtitle">by {article.author.username}</h3>
                                     <p className="article-index-snippet">{article.snippet}{"..."}</p>
                                     <ArticleTags tags={["lookAtThisTag", "othertag"]} />
                                     <h4>{article.count} Commented {article.likeCount} Liked</h4>
                                  </Link>

                                </div> */