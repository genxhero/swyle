import React from 'react';
import { useQuery } from '@apollo/client';
import postsByUser from './queries/posts_by_user';
import PostCard from './post_card';

/**
 * Expected Props:
 * UserId: Integer, ID of current user.
 */

const UserPosts = (props) => {
    const { loading, error, data } = useQuery(postsByUser, {
        variables: { userId: props.userId },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error </p>;

    return (
        <div className={`user-posts user-posts-${props.colorScheme}`}>
            <div>
                {data.postsByUser.map(post => (
                    <PostCard post={post} colorScheme={props.colorScheme} key={post.title + post.id} />
                ))}
            </div>
        </div>
    );
};

export default UserPosts;

// old code below
/**
import React from 'react';
import postsByUser from './queries/posts_by_user';
import { Query } from 'react-apollo';
import PostCard from './post_card';
*/

/**
 * Expected Props:
 * UserId: Integer, ID of current user.
 */
/**
const UserPosts = (props) => {
return (
    <div className={`user-posts user-posts-${props.colorScheme}`}>
        <Query query={postsByUser} variables={{ userId: props.userId }}>
            {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error </p>;
                return (
                    <div>
                        {data.postsByUser.map(post => {
                            return (
                                <PostCard post={post} colorScheme={props.colorScheme} key={post.title + post.id} />
                            )
                        })}
                    </div>
                )
            }}
        </Query>

    </div>
)
}

export default UserPosts;
*/
/**
 *    <div className={`user-posts-card user-posts-card-${props.colorScheme}`} key={`${post.title}${post.id}`}>
                                    <h3 >{post.title}</h3>
                                    {post.image && <div className="user-posts-thumbnail-container"><img src={post.image} alt={post.image.title} /> </div>}
                                    {post.snippet && <p>{post.snippet}<span style={{ "color": "gray" }}>...</span></p>}
                                </div>
 */
