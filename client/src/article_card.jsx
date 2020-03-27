import React from 'react';
import ArticleTags from './article_tags';
import ReactMarkdown from 'react-markdown';

const ArticleCard = props => {
    const {date, colorScheme, article } = props;
    return (
        <div className={`article-index-card ${colorScheme}`} key={`${article.id}${article.title}${date}`}>
            <Link className={`article-index-show-link ${colorScheme}`} to={`/articles/${article.id}`}>
                <h2 className="article-index-title">{article.title}</h2>
                <h3 className="article-index-subtitle">by {article.author.username}</h3>
                <div><ReactMarkdown source={article.snippet} /> <span>{"..."}</span></div>
                <ArticleTags tags={["lookAtThisTag", "othertag"]} />
                <h4>{article.count} Commented {article.likeCount} Liked</h4>
            </Link>
        </div>
    )
}

export default ArticleCard;