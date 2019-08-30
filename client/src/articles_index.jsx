import React, {Component} from 'react';
import articles from './queries/articles';
import { Query } from "react-apollo";
import {Link} from 'react-router-dom';
import ArticleTags from './article_tags';

class ArticlesIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const date = Date.now();    
        return (
            <Query query={articles}>
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :(</p>;

                    return ( 
                    <div className="article-index-page"> 
                      {  data.articles.map((article) => (
                            <div className="article-index-card" key={`${article.id}${article.title}${date}`}>
                              <h2 className="article-index-title">{article.title}</h2>
                              <h3 className="article-index-subtitle">by {article.author.username}</h3>
                              <p className="article-index-snippet">{article.snippet}<Link className="article-index-show-link" to={`/articles/${article.id}`}>{"...more"}</Link></p>
                                <ArticleTags tags={["lookAtThisTag", "othertag"] } />
                                <h4>0 Comments 0 Likes</h4>                           
                            </div>
                        ))}
                    </div>
                    )
                }}
            </Query>
        );
    }
}

export default ArticlesIndex;