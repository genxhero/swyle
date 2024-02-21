import React from 'react';
import { useQuery } from '@apollo/client';
import commentsByUser from './queries/comments_by_user';

/**
 * Displays recent comments by the current user
 * 
 * colorScheme: String, color scheme chosen by the user
 * userId: Integer, primary key for the users table 
 */
const UserComments = (props) => {
    const { loading, error, data } = useQuery(commentsByUser, {
        variables: { userId: props.userId },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    return (
        <div className={`user-comments user-comments-${props.colorScheme}`}>
            <div>
                {data.commentsByUser.map(comment => (
                    <div className={`user-comments-card user-comments-card-${props.colorScheme}`} key={comment.id}>
                        <h4>You commented:</h4>
                        <p className={`user-comments-card-body user-comments-card-body-${props.colorScheme}`}>{comment.body}</p>
                        <h5>
                            <span>
                                On <span>{comment.post.title}</span> by <span>{comment.post.author.username}</span>
                                <span> at {comment.createdAt}</span>
                            </span>
                        </h5>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserComments;

/**
import React from 'react';
import commentsByUser from './queries/comments_by_user';
import { Query } from 'react-apollo';


/**
 * Displays recent comments by the current user
 * 
 * colorScheme: String, color scheme chosen by the user
 * userId: Integer, primary key for the users table 
 
const UserComments = (props) => {
    return (
        <div className={`user-comments user-comments-${props.colorScheme}`}>
            <Query query={commentsByUser} variables={{ userId: props.userId }}>
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error </p>;
                    return (
                        <div>
                            {data.commentsByUser.map(comment => {
                                return (
                                    <div className={`user-comments-card user-comments-card-${props.colorScheme}`} key={`${comment.id}`}>
                                        <h4>You commented:</h4>
                                        <p className={`user-comments-card-body user-comments-card-body-${props.colorScheme}`}>{comment.body}"</p>
                                        <h5> <span>
                                            On <span>{comment.post.title}</span> by <span>{comment.post.author.username}</span>
                                            <span> at {comment.createdAt}</span>
                                        </span> </h5>
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

export default UserComments;
*/
