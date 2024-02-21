/**
 * Contains user comments belonging to a given post, as well as a form for creating a new comment.
 * 
 * Expected Props
 *      postType: String - whether the post is an image or an article
 *      postId: Integer - ID number of the post
 *      comments: Array of objects - The comments themselves.
 */

import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import postCommentMutation from './mutations/post_comment';
import articleQuery from './queries/article';
import imageQuery from './queries/image';
import Comment from './comment';

const CommentSection = ({ colorScheme, postType, comments, currentUser, articleAuthorId, postId }) => {
    const [body, setBody] = useState("");

    const query = postType === "Article" ? articleQuery : imageQuery;

    const [postComment, { loading }] = useMutation(postCommentMutation, {
        refetchQueries: [{ query, variables: { id: postId } }]
    });

    const handleFormChange = field => event => {
        setBody(event.currentTarget.value);
    };

    const handleSubmit = event => {
        event.preventDefault();
        postComment({
            variables: {
                body,
                userId: currentUser.id,
                postId,
                postType
            }
        }).then(res => {
            setBody("");
        });
    };

    return (
        <div className={`comments-section ${colorScheme}`}>
            {currentUser ? (
                <form className="comment-add" onSubmit={handleSubmit}>
                    <textarea
                        placeholder="Please Enter your comment here"
                        onChange={handleFormChange("body")}
                        value={body}
                        resize="none"
                    />
                    <input className="comment-submit" type="submit" name="Post Comment" value="Post Comment" />
                </form>
            ) : (
                <div className="please-login-div">
                    <span className="please-login-message">
                        Please <Link className="please-login-button" to="/login">Log In</Link> or <Link className="please-login-button inverse" to="/register">Sign Up</Link> to post comments
                    </span>
                </div>
            )}
            <h4 style={{ "marginLeft": "1rem" }}>Latest Comments</h4>
            {comments.map((comment, index) => {
                let commentStyle = index % 2 === 0 ? { "background": "lightgrey" } : { "background": "white" };
                if (colorScheme === "bonetrousle") commentStyle = { "background": "black" };
                return (
                    <Comment
                        comment={comment}
                        commentStyle={commentStyle}
                        currentUser={currentUser}
                        articleAuthorId={articleAuthorId}
                        postType={postType}
                        postId={postId}
                        key={`SHUT UP, LINT! ${comment.id}`}
                    />
                );
            })}
        </div>
    );
};

export default CommentSection;

/**
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';
import postComment from './mutations/post_comment';
import article from './queries/article';
import image from './queries/image';
import Comment from './comment';

class CommentSection extends Component {

    constructor(props) {
        super(props)
        this.state = {
            body: ""
        }
        this.handleFormChange = this.handleFormChange.bind(this);
    }

    handleFormChange(field) {
        return event => this.setState({
            [field]: event.currentTarget.value,
        });
    }

    render() {
        const query = this.props.postType === "Article" ? article : image;
        const comments = this.props.comments;
        return (

            <div className={`comments-section ${this.props.colorScheme}`}>

                            {this.props.currentUser ?
                                <Mutation mutation={postComment}
                                    update={(cache, { data: { postComment } }) => {
                                    }}
                                    refetchQueries={[{ query: query, variables: { id: this.props.postId } }]}
                                >
                                    {(postComment, loading) =>
                                        !loading ? (
                                     <div className="loading-div"><img className="loading-img" alt="load" src="https://i.gifer.com/origin/4d/4dc11d17f5292fd463a60aa2bbb41f6a_w200.gif" /></div>
                                    ) : (
                                                <form className="comment-add" onSubmit={event => {
                                                    event.preventDefault();
                                                    postComment({
                                                        variables: {
                                                            body: this.state.body,
                                                            userId: this.props.currentUser.id,
                                                            postId: this.props.postId,
                                                            postType: this.props.postType
                                                        }
                                                    }).then(res => {
                                                        this.setState({ body: "" })
                                                    })
                                                }}>
                                                    <textarea placeholder="Please Enter your comment here" onChange={this.handleFormChange("body")} value={this.state.body} resize="none" />
                                                    <input className="comment-submit" type="submit" name="Post Comment" value="Post Comment" />
                                                </form>
                                            )
                                    }

                                </Mutation>
                                :
                                <div className="please-login-div">
                                    <span className="please-login-message">Please <Link className="please-login-button" to="/login">Log In</Link> or <Link className="please-login-button inverse" to="register">Sign Up</Link> to post comments</span>
                                </div>
                            }
                            <h4 style={{ "marginLeft": "1rem" }}>Latest Comments</h4>
                            {comments.map(
                                (comment, index) => {
                                    let commentStyle = index % 2 === 0 ? { "background": "lightgrey" } : { "background": "white" }
                                    if (this.props.colorScheme === "bonetrousle")  commentStyle = {"background": "black"};
                                    return <Comment
                                        comment={comment}
                                        commentStyle={commentStyle}
                                        currentUser={this.props.currentUser}
                                        articleAuthorId={this.props.articleAuthorId}
                                        postType={this.props.postType}
                                        postId={this.props.postId}
                                        key={`SHUT UP, LINT! ${comment.id}`}
                                    />
                                }
                            )}
                        </div>
               
        )
    }
}

export default CommentSection
*/
