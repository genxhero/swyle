import React, {Component} from 'react';
import {Query} from 'react-apollo';
import article from './queries/article';
import CommentSection from './comment_section';

class ArticleShow extends Component {

    render() {
       const argument = parseInt(this.props.match.params.articleID)
        return (
            <Query query={article} variables={{ id: argument}}>
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :(</p>;
                        const article = data.article;
                    return (
                        <div className="article-show-page">
                            <div className="article-section">
                                 <h1>{article.title}</h1>
                                 <h3>by {article.author.username}</h3>
                                 <p>{article.body}</p> 
                            </div>
                                      
                              <CommentSection type={"Article"} currentUser={data.currentUser} postId={argument} articleAuthorId={article.author.id} />
                        </div>
                    )
                }}
            </Query>
        )
    }

}

export default ArticleShow;