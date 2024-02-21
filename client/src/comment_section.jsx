/**
 * Deprecated version; the delete subscription was returning errors.'
 * Might reinstate if I can get the other version of the subscription to work.
 */

/**
import React, { Component } from 'react';
import {Mutation, Query} from 'react-apollo';
import {Link} from 'react-router-dom';
import postComment from './mutations/post_comment';
import commentsByPost from './queries/comments_by_post';
import Comment from './comment';
import Subscription from './comment_subscription';


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


    render () {
        const colorScheme = this.props.currentUser.colorScheme || ""
        return (
            <Query query={commentsByPost} variables={{postId: this.props.postId, postType: this.props.type}}>
            {({ loading, error, data, subscribeToMore}) => {
                
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :(</p>;
                        
                return (
                    <div className={`comments-section ${colorScheme}`}>

                        {this.props.currentUser ?
                            <Mutation mutation={postComment}
                                update={(cache, { data: { postComment } }) => {
                                }}
                                refetchQueries={[{ query: commentsByPost, variables: { postId: this.props.postId, postType: this.props.type } }]}
                            >
                                {(postComment, loading) =>
                                    !loading ? (
                                        "..."
                                    ) : (
                                            <form className="comment-add" onSubmit={event => {
                                                event.preventDefault();
                                                postComment({
                                                    variables: {
                                                        body: this.state.body,
                                                        userId: this.props.currentUser.id,
                                                        postId: this.props.postId,
                                                        postType: this.props.type
                                                    }
                                                }).then(res => {
                                                    this.setState({ body: "" })
                                                })
                                            }}>
                                                <textarea placeholder="Please Enter your comment here" onChange={this.handleFormChange("body")} value={this.state.body} resize="none"/>
                                                <input className="comment-submit"type="submit" name="Post Comment" value="Post Comment" />
                                            </form>
                                        )
                                }

                            </Mutation>
                            :
                            <span>Please <Link to="/login">Log In</Link> or <Link to="register">Sign Up</Link> to post comments</span>
                        }                        
                        <h4 style={{"marginLeft":"1rem"}}>Latest Comments</h4>
                        {data.commentsByPost.map(
                            (comment, index) => {
                                
                                const commentStyle = index % 2 === 0 ? {"background":"lightgrey"} : {"background":"white"}
                                return <Comment 
                                        comment={comment} 
                                        commentStyle={commentStyle} 
                                        currentUser={this.props.currentUser} 
                                        articleAuthorId={this.props.articleAuthorId}
                                        postType={this.props.type}
                                        postId={this.props.postId}
                                        key={`SHUT UP, LINT! ${comment.id}`}
                                        />
                            }
                        )}
                        <Subscription subscribeToMore={subscribeToMore} />
                    </div>
                )
            }}
            </Query>
        )
    }
}

export default CommentSection
*/
