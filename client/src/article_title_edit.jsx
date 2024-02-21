import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import updateArticleTitle from './mutations/update_article_title';
import article from './queries/article';

const ArticleTitleEdit = (props) => {
    const [title, setTitle] = useState(props.title);

    const [updateArticleTitleMutation, { loading }] = useMutation(updateArticleTitle);

    const handleFormChange = (event) => {
        setTitle(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updateArticleTitleMutation({
            variables: {
                title: title,
                id: props.id
            },
            refetchQueries: [{ query: article, variables: { id: props.id } }]
        }).then(res => {
            props.finishEdit("Title");
        });
    };

    return (
        <div className="edit-title">
            {!loading ? (
                "..."
            ) : (
                <form className="edit-title" onSubmit={handleSubmit}>
                    <input className="edit-title-text" type="text" value={title} onChange={handleFormChange} />
                    <span className="edit-save-or-cancel">
                        <input type="submit" value="Save" className="confirm-btn-yes" name="Save" />
                        <button onClick={props.cancelEdit} className="confirm-btn-no" name="Title">Cancel</button>
                    </span>
                </form>
            )}
        </div>
    );
};

export default ArticleTitleEdit;

/**
import React, { Component } from 'react';
import {Mutation} from 'react-apollo';
import updateArticleTitle from './mutations/update_article_title'
import article from './queries/article';


class ArticleTitleEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: this.props.title,
            id: this.props.id
        }
        this.handleFormChange = this.handleFormChange.bind(this)
    }

    handleFormChange(field) {
        return event => this.setState({
            [field]: event.currentTarget.value,
        });
    }

    render() {
        return (
            <div className="edit-title">
                <Mutation mutation={updateArticleTitle}
                    update={(cache, { data: { updateArticleTitle } }) => {
                    }}
                    refetchQueries={[{ query: article, variables: { id: this.props.id} }]}
                
                >{(updateArticleTitle, loading) =>
                    !loading ? (
                        "..."
                    ) : ( 
                    <form className="edit-title" onSubmit={event => {
                            event.preventDefault();
                            updateArticleTitle({
                                variables: {
                                    title: this.state.title,
                                    id: this.props.id
                                }
                            }).then(res => {
                                this.props.finishEdit("Title");
                            })
                        }}>
                            <input className="edit-title-text" type="text" value={this.state.title} onChange={this.handleFormChange("title")}></input>
                            <span className="edit-save-or-cancel">
                                <input type="submit" value="Save"className="confirm-btn-yes" name="Save" />
                                <button onClick={this.props.cancelEdit} className="confirm-btn-no" name="Title">Cancel</button>
                            </span>
                        </form>
                    )}
                </Mutation>
            
            </div>
        )
    }
}

export default ArticleTitleEdit;
*/
