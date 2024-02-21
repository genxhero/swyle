
import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import postArticleMutation from './mutations/post_article';
import currentUserQuery from './queries/current_user';
import articlesQuery from './queries/articles';
import { Redirect } from 'react-router-dom';
import FormattingButtons from './formatting_buttons';

const ArticleCreate = (props) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const { loading, data } = useQuery(currentUserQuery);
    const [postArticle] = useMutation(postArticleMutation, {
        refetchQueries: [{ query: articlesQuery }]
    });

    const handleFormChange = (field) => {
        return (event) => {
            if (field === 'title') {
                setTitle(event.currentTarget.value);
            } else {
                setBody(event.currentTarget.value);
            }
        };
    };

    const save = async (e) => {
        e.preventDefault();
        postArticle({
            variables: { title: title, body: body }
        }).then(res => {
            props.history.push(`/articles/${res.data.createArticle.id}`);
        });
    };

    if (loading) {
        return <div><img alt="loady" src="https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif?cid=790b7611672a658dd9b96b70df5cfe96a2bf98f81e8ab339&rid=giphy.gif" /></div>;
    }

    if (!data.currentUser) {
        return <Redirect to="/login" />;
    }

    return (
        <div className={`article-create-page ${props.colorScheme || 'classic'}`}>
            <form className={`article-create-form ${props.colorScheme || 'classic'}`} onSubmit={save}>
                <span className="post-creation-label">Article Title</span>
                <input className={`article-create-title ${props.colorScheme || 'classic'}`} type="text" onChange={handleFormChange("title")} value={title} />
                <span className="post-creation-label">Article Body - <a href="https://www.markdownguide.org/basic-syntax">Markdown</a> Now Supported</span>
                <FormattingButtons elementId={"new-article-text"} updateState={(val) => { setBody(val) }} />
                <textarea id="new-article-text" className={`article-create-body ${props.colorScheme || 'classic'}`} type="text" onChange={handleFormChange("body")} value={body} />
                <input type="submit" className={`submit ${props.colorScheme}`} value="Post Article" disabled={!body} />
            </form>
        </div>
    );
};

export default ArticleCreate;

/**
import React, { Component } from 'react';
import postArticle from './mutations/post_article';
import currentUser from './queries/current_user';
import articles from './queries/articles';
import { graphql } from 'react-apollo';
import * as compose from 'lodash.flowright';
import {Redirect} from 'react-router-dom';
import FormattingButtons from './formatting_buttons';

class ArticleCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            body: ""
        }
        this.handleFormChange = this.handleFormChange.bind(this)
        this.save = this.save.bind(this)
    }


    handleFormChange(field) {
        return event => this.setState({
            [field]: event.currentTarget.value,
        });
    }

    async save(e) {
        e.preventDefault();
        this.props.mutate({
            variables: {
                title: this.state.title,
                body: this.state.body,
            },
            refetchQueries: [{query: articles}]
        }).then(res => {
            this.props.history.push(`/articles/${res.data.createArticle.id}`)
        })
    }

    render() {
        if (this.props.data.loading) {
            return <div><img alt="loady" src="https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif?cid=790b7611672a658dd9b96b70df5cfe96a2bf98f81e8ab339&rid=giphy.gif" /></div>
        }
        if (!this.props.data.currentUser) {
            return <Redirect to="/login" />
        }
        return (
            <div className={`article-create-page ${this.props.colorScheme || 'classic'}`}>
                <form className={`article-create-form ${this.props.colorScheme || 'classic'}`} onSubmit={this.save}>
                    <span className="post-creation-label">Article Title</span>
                    <input className={`article-create-title ${this.props.colorScheme || 'classic'}`} type="text" onChange={this.handleFormChange("title")}  value={this.state.title} />
                    <span className="post-creation-label">Article Body - <a href="https://www.markdownguide.org/basic-syntax">Markdown</a> Now Supported</span>
                    <FormattingButtons elementId={"new-article-text"} updateState={ (val) => {
                        this.setState({body: val})
                    }}/>
                    <textarea id="new-article-text" className={`article-create-body ${this.props.colorScheme || 'classic'}`} type="text" onChange={this.handleFormChange("body")} value={this.state.description} />
                    <input type="submit" className={`submit ${this.props.colorScheme}`} value="Post Article" disabled={!this.state.body} />
                </form>
            </div>
        )
    }
}



export default compose(
    graphql(currentUser)
)(
    graphql(postArticle)(ArticleCreate)
)  */
