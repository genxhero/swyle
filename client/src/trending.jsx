/* eslint no-restricted-globals: 0 */  // --> OFF

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import query from './queries/posts_by_popularity';
import PostCard from './post_card';

const Trending = ({ colorScheme }) => {
    const [activePane, setActivePane] = useState("likes");

    const { loading, data } = useQuery(query);
    
    const selectPane = (event) => {
        const selection = event.target.getAttribute('name');
        setActivePane(selection);
    };

 
    const sortPosts = (attribute) => {
        const posts = [...data.postsByPopularity]
        
        return posts.sort((b, a) => {
            let valA = a[attribute];
            let valB = b[attribute];
            return (valA < valB) ? -1 : (valA > valB) ? 1 : 0;
        });
    }

    if (loading) {
        return (
            <div className={`loading-div loading-div-${colorScheme}`}>
                <img className="loading-img" alt="load" src="https://i.gifer.com/origin/4d/4dc11d17f5292fd463a60aa2bbb41f6a_w200.gif" />
            </div>
        );
    }

    const attribute = activePane === 'comments' ? 'count' : 'likeCount';
    const posts = sortPosts(attribute);

    return (
        <div className={`trending-posts-page trending-posts-page-${colorScheme}`}>
            <h1 className={`trending-posts-title trending-posts-title-${colorScheme}`}>Most Popular Posts</h1>
            <div className={`trending-posts-backpane ${colorScheme}`}>
                <div className={`trending-posts-nav ${colorScheme}`}>
                    <div
                        className={`trending-posts-tab${activePane === 'likes' ? `-active ${colorScheme}` : `-inactive ${colorScheme}`}`}
                        name="likes"
                        onClick={selectPane}
                    >
                        By Likes
                    </div>
                    <div
                        className={`trending-posts-tab${activePane === 'comments' ? `-active ${colorScheme}` : `-inactive ${colorScheme}`}`}
                        name="comments"
                        onClick={selectPane}
                    >
                        By Comments
                    </div>
                </div>
                <div className={`trending-posts-content ${colorScheme}`}>
                    {posts.map(post => (
                        <PostCard colorScheme={colorScheme} post={post} key={post.title + post.id} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Trending;


//old code below
/**
import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import query from './queries/posts_by_popularity';
// import { parseUrl} from './helpers';
import PostCard from './post_card';

/**
 * The trending page allows users to sort posts by Likes and by number of Comments. No insane analytics, just the goods fair and plain.
 * The single responsibility of this component is "display a sorted list of posts based on user choices"
 */
/**
class Trending extends Component {

    constructor(props) {
        super(props);
        this.state = {
            shutUpLint: true,
            activePane: "likes"
        }
        this.selectPane = this.selectPane.bind(this)
    }

    selectPane(event) {
        event.preventDefault();
        event.stopPropagation();
        let selection = event.target.getAttribute('name')
        this.setState({activePane: selection})
    }

    
     // Sorts posts based on a specific attribute such as comment count or number of likes.
     // Yes, it does it on the front end, and I'm not sorry.
     // @param {string} attribute 
     
    sortPosts(attribute) {
       const posts = this.props.data.postsByPopularity.sort((b, a) => {
           let valA = a[attribute];
           let valB = b[attribute];
           return (valA < valB) ? -1 : (valA > valB) ? 1 : 0;
       });
       return posts;
    }

    render() {
        if (this.props.data.loading) {
            return <div className={`loading-div loading-div-${this.props.colorScheme}`}><img className="loading-img" alt="load" src="https://i.gifer.com/origin/4d/4dc11d17f5292fd463a60aa2bbb41f6a_w200.gif" /></div>;
        }
        const attribute = this.state.activePane === 'comments' ? 'count' : 'likeCount'
        const posts = this.sortPosts(attribute);
        const colorScheme = this.props.colorScheme;
        
        return (  
            <div className={`trending-posts-page trending-posts-page-${this.props.colorScheme}`}>
            <h1 className={`trending-posts-title trending-posts-title-${this.props.colorScheme}`}>Most Popular Posts</h1>
          
                <div className={`trending-posts-backpane ${colorScheme}`}>
                  <div className={`trending-posts-nav ${colorScheme}`}>
                <div className={`trending-posts-tab${this.state.activePane === 'likes' ? `-active ${colorScheme}` : `-inactive ${colorScheme}`}`} 
                name="likes"
                onClick={this.selectPane}
                >
                    By Likes
                </div>
                        <div className={`trending-posts-tab${this.state.activePane === 'comments' ? `-active ${colorScheme}` : `-inactive ${colorScheme}` }`} 
                    name="comments"
                    onClick={this.selectPane}
                    >
                    By Comments
                </div>
            </div>
                <div className={`trending-posts-content ${colorScheme}`}>
                {
                        posts.map(
                            post => {
                                return (
                                    <PostCard colorScheme={colorScheme} post={post} key={post.title + post.id} />
                                )
                            }
                        )
                }
                </div>
            </div>

        </div>
        )
    }
}

export default graphql(query)(Trending);
*/

/**
 * <div className={`user-posts-card user-posts-card-${colorScheme}`} key={`${post.title}${post.id}`}>
                                        <h3 ><Link to={`${url}/${post.id}`}>{post.title}</Link></h3>
                                        {post.image && <div className="user-posts-thumbnail-container"><img src={post.image} alt={post.image.title} /> </div>}
                                        {post.snippet && <p>{post.snippet}<span style={{ "color": "gray" }}>...</span></p>}
                                        <h4>{post.count} Comments {post.likeCount} Likes</h4>
                                    </div>
 */
