import React from 'react';

/**
 * 
 * This displays all of the tags belonging to a post.
 */
const Tags = (props) => {
    return (
        <span className="article-card-tags">{props.tags.map( tag => <span key={tag}>{`#${tag} `}</span>)}</span>
    )
}

export default Tags;