import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import updateComment from './mutations/update_comment';
import article from './queries/article';
import image from './queries/image';

const CommentEdit = (props) => {
    const [body, setBody] = useState(props.comment.body);

    const refetch = props.postType === "Article" ? article : image;

    const [updateCommentMutation] = useMutation(updateComment, {
        refetchQueries: [{ query: refetch, variables: { id: props.postId } }]
    });

    const handleFormChange = (event) => {
        setBody(event.currentTarget.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updateCommentMutation({
            variables: {
                body: body,
                id: props.comment.id,
                postType: props.postType
            }
        }).then(res => {
            props.cancelEdit();
        });
    };

    return (
        <div className="comment">
            <form className="comment-edit-form" onSubmit={handleSubmit}>
                <textarea
                    className="comment-edit-body"
                    value={body}
                    onChange={handleFormChange}
                />
                <div className="comment-edit-buttons">
                    <input className="confirm-btn-yes" type="submit" />
                    <button className="confirm-btn-no" onClick={props.cancelEdit}> Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default CommentEdit;

/**
import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import updateComment from './mutations/update_comment';
import article from './queries/article';
import image from './queries/image';


 // Component form for editing a user comment.  Refetches the query for which ever post it belongs to in order to update the dom
 

class CommentEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            body: this.props.comment.body
        }
        this.handleFormChange = this.handleFormChange.bind(this)
    }

    handleFormChange(field) {
        return event => this.setState({
            [field]: event.currentTarget.value,
        });
    }

    render () {
        const refetch = this.props.postType === "Article" ? article : image
        return(
            <div className="comment">
                <Mutation mutation={updateComment}
                    update={(cache, { data: { updateComment } }) => {
                    }}
                    refetchQueries={[{ query: refetch, variables: { id: this.props.postId} }]}
                >
                    {(updateComment, loading) =>
                        !loading ? (
                            "..."
                        ) : ( 
                    <form className="comment-edit-form" onSubmit={event => {
                                    event.preventDefault();
                                    updateComment({
                                        variables: {
                                            body: this.state.body,
                                            id: this.props.comment.id,
                                            postType: this.props.postType
                                        }
                                    }).then(res => {
                                        this.props.cancelEdit();
                                    })
                                }}>
                    <textarea className="comment-edit-body" value={this.state.body} onChange={this.handleFormChange("body")}/>
                    <div className="comment-edit-buttons">
                        <input className="confirm-btn-yes" type="submit" />
                        <button className="confirm-btn-no" onClick={this.props.cancelEdit}> Cancel</button>
                    </div>
                </form>
                            )}
                </Mutation>  
            </div>
            
        )
    }
}

export default CommentEdit; */
