import React from 'react';
import postsByUser from './queries/posts_by_user';


/**
 * Expected Props:
 * UserId: Integer, ID of current user.
 */

const UserPosts = (props) => {
return (
    <div className="user-posts">
        <h3 style={{ "textAlign": "center", "color": "white" }}> Posts</h3>
        <Query query={postsByUser} variables={{ userId: props.userId }}>
            {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error </p>;
                return (
                    <div>
                        {data.postsByUser.map(post => {
                            return (
                                <div className="user-posts-card" key={`${post.title}${post.id}`}>
                                    <h3 >{post.title}</h3>
                                    {post.image && <div className="user-posts-thumbnail-container"><img src={post.image} alt={post.image.title} /> </div>}
                                    {post.snippet && <p>{post.snippet}<span style={{ "color": "gray" }}>...</span></p>}
                                </div>
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