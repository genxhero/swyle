import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import comments from './queries/comments_by_post';
import deleteComment from './mutations/delete_comment';
import CommentEdit from './comment_edit';
import { MdDelete, MdEdit } from 'react-icons/md';

const Comment = (props) => {
    const [editing, setEditing] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [top, setTop] = useState("0");

    const [deleteCommentMutation] = useMutation(deleteComment);

    const editComment = () => {
        setEditing(true);
    };

    const cancelEdit = () => {
        setEditing(false);
    };

    const openConfirmationModal = (event) => {
        event.preventDefault();
        const theComment = document.getElementById(`the-comment${props.comment.id}`);
        let newTop = "0";
        if (theComment.offsetHeight < 120) {
            newTop = "-1.5rem";
        }
        setTop(newTop);
        setConfirmationOpen(true);
    };

    const closeConfirmationModal = (event) => {
        event.preventDefault();
        setConfirmationOpen(false);
    };

    const deleteCommentHandler = (event) => {
        deleteCommentMutation({
            variables: { id: props.comment.id },
            refetchQueries: [{ query: comments, variables: { postId: props.postId, postType: props.postType } }]
        });
    };

    let colorScheme = "classic";
    if (props.currentUser) {
        colorScheme = props.currentUser.colorScheme;
    }

    if (editing) {
        return <CommentEdit comment={props.comment} cancelEdit={cancelEdit} postId={props.postId} postType={props.postType} />;
    } else {
        return (
            <div id={`the-comment${props.comment.id}`} key={props.comment.body} className={`comment ${colorScheme}`} style={props.commentStyle}>
                <div style={{ "display": "flex", "flexDirection": "column" }}>
                    <p className="comment-body">{props.comment.body}</p>
                    <span className="comment-who-and-when"> {`${props.comment.commentor.username}, on ${props.comment.createdAt}`}</span>
                </div>
                <div className={`comment-buttons ${colorScheme}`}>
                    {props.currentUser && ((props.currentUser.id === props.comment.commentor.id)) && <span className="comment-btn" onClick={editComment}><MdEdit /> </span>}
                    {props.currentUser && ((props.currentUser.id === props.comment.commentor.id) || props.currentUser.id === props.articleAuthorId) && <span className="comment-btn" onClick={openConfirmationModal}><MdDelete /></span>}
                    {confirmationOpen && (
                        <div className="comment-delete-confirm" style={{ "top": `${top}` }}>
                            <div className="confirmation-dialog">
                                <h4>Remove Comment?</h4>
                                <div style={{ "display": "flex", "justifyContent": "center" }}>
                                    <button className="confirm-btn-yes" onClick={deleteCommentHandler} value={props.comment.id}>Yes</button>
                                    <button className="confirm-btn-no" onClick={closeConfirmationModal}>No</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
};

export default Comment;


/**
import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import comments from './queries/comments_by_post';
import deleteComment from './mutations/delete_comment';
import CommentEdit from './comment_edit';
import { MdDelete, MdEdit } from 'react-icons/md';

class Comment extends Component {

    constructor(props){
        super(props);
        this.state = {
            editing: false,
            confirmationOpen: false,
            top: "0"
        }

        this.cancelEdit = this.cancelEdit.bind(this)
        this.editComment = this.editComment.bind(this);
        this.openConfirmationModal = this.openConfirmationModal.bind(this)
        this.closeConfirmationModal = this.closeConfirmationModal.bind(this)
        this.deleteComment = this.deleteComment.bind(this)
    }

    editComment () {
        this.setState({editing: true})
    }

    cancelEdit () {
        this.setState({editing: false})
    }

    openConfirmationModal (event) {
        event.preventDefault();
        const theComment = document.getElementById(`the-comment${this.props.comment.id}`);
        let top = "0";
        if (theComment.offsetHeight < 120) {
            top = "-1.5rem"
        }
        this.setState(() => { return { confirmationOpen: true, top} })
    }

    closeConfirmationModal(event) {
        event.preventDefault();
        this.setState(() => { return { confirmationOpen: false } })
    }

    deleteComment(event) {
        this.props.mutate({
            variables: { id: this.props.comment.id },
            refetchQueries: [{ query: comments, variables:{ postId: this.props.postId, postType: this.props.postType} }]
        })
    }

    render() {
        let colorScheme = "classic"
        if (this.props.currentUser) {
             colorScheme = this.props.currentUser.colorScheme;
        }
        if (this.state.editing) {
            return < CommentEdit comment={this.props.comment} cancelEdit={this.cancelEdit} postId={this.props.postId} postType={this.props.postType}/>
        } else {
            
            return (
                <div id={`the-comment${this.props.comment.id}`} key={this.props.comment.body} className={`comment ${colorScheme}`} style={this.props.commentStyle}>
                    <div style={{ "display": "flex", "flexDirection": "column" }}>
                        <p className="comment-body">{this.props.comment.body}</p>
                        <span className="comment-who-and-when"> {`${this.props.comment.commentor.username}, on ${this.props.comment.createdAt}`}</span>
                    </div>
                    <div className={`comment-buttons ${colorScheme}`}>
                        {this.props.currentUser && ( (this.props.currentUser.id === this.props.comment.commentor.id)) && <span className="comment-btn" onClick={this.editComment}><MdEdit /> </span>}
                        {this.props.currentUser &&  ((this.props.currentUser.id === this.props.comment.commentor.id) || this.props.currentUser.id === this.props.articleAuthorId) && <span className="comment-btn" onClick={this.openConfirmationModal}><MdDelete /></span>}
                        {this.state.confirmationOpen && (
                            <div className="comment-delete-confirm" style={{"top":`${this.state.top}`}}>
                                <div className="confirmation-dialog">
                                    <h4>Remove Comment?</h4>
                                    <div style={{ "display": "flex", "justifyContent": "center" }}>
                                        <button className="confirm-btn-yes" onClick={this.deleteComment} value={this.props.comment.id}>Yes</button>
                                        <button className="confirm-btn-no" onClick={this.closeConfirmationModal}>No</button>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>

                </div>
            )
        }
    }

}

export default graphql(deleteComment)(Comment); */
