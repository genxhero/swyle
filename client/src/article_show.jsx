/**
 * Displays all data for a single article
 */

import React, {Component} from 'react';
import {Query} from 'react-apollo';
import article from './queries/article';
import articles from './queries/articles';
import deleteArticle from './mutations/delete_article';
import  { graphql } from 'react-apollo'
import CommentSection from './comment_section_refactor';
import ArticleBodyEdit from './article_body_edit';
import ArticleTitleEdit from './article_title_edit';
import $ from 'jquery';
import { MdDelete, MdEdit} from 'react-icons/md';
import ConfirmationModal from './confirmation_modal';
import Subscription from './article_subscription';
import Reaction from './reaction';
import Tooltip from './tooltip';

class ArticleShow extends Component {

    constructor(props) {
        super(props)
        this.state = {
            editingBody: false,
            editingTitle: false,
            confirmationOpen: false,
            titleTooltipOpen: false,
            bodyTooltipOpen: false,
            deleteTooltipOpen: false
        }
        this.cancelEdit = this.cancelEdit.bind(this);
        this.finishEdit = this.finishEdit.bind(this);
        this.editField = this.editField.bind(this);
        this.deleteArticle = this.deleteArticle.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }
    /**
     * Params: None
     * Closes the confirmation modal, used for article deletion
     */
    closeModal(){
        $('body').css('overflow', 'auto');
        this.setState({confirmationOpen: false})
    }

    /**
     * Params: None
     * Used to open a dialog modal asking the user to confirm whether to delete an article.
     */
    openModal() {
        $('body').css('overflow', 'hidden');
        this.setState({ confirmationOpen: true })
    }

    /**
     * Returns a field (body or title) to its read-only state.
     * @param {*} event 
     */
    cancelEdit(event) {
        $('body').css('overflow', 'auto');
        this.setState({ [`editing${event.target.name}`]: false })
    }

    /**
     * TODO: Find out if removing this one, or the above one, would make the app still work
     * @param {*} field 
     */
    finishEdit(field) {
        $('body').css('overflow', 'auto');
        this.setState({ [`editing${field}`]: false })
    }

    /**
     * Opens a form in place of an article element, e.g. Title, Body
     * Dynamically sets a slice of state equal to the id of the target of the click event.
     * @param {*} event 
     */
    editField(event) {
        event.preventDefault();
        this.setState({ [`editing${event.target.id}`]: true });
    }

    /**
     * Calls the mutation deleteArticle which, as one might guess, removes the current article from the database
     * Upon completion, the articles index query is refetched and the user is redirected to the articles index page. 
     *
     * @param {*} e 
     */
    deleteArticle(e) {
        e.preventDefault();
        const id = this.props.match.params.articleID
        this.props.mutate({
            variables: { id: parseInt(id) },
            refetchQueries: [{query: articles}]
        }).then(res => {
            this.props.history.push("/");
        })
    }

    /**
     * It's the render method.  It renders a Query component with all of our relevant data inside of it.
     * The Subscription element at the bottom of the component allows the article to automatically update when it is changed, reacted to, or commented on
     * TODOS
     *    Change this into a functional component with React Hooks.
     *    Add tags
     */
    render() {
       const argument = parseInt(this.props.match.params.articleID)
       const colorScheme = this.props.colorScheme || "standard"
       const currentUser = this.props.currentUser;
        return (
            <Query query={article} variables={{ id: argument }} >
                {({ loading, error, data, subscribeToMore}) => {
                    if (loading) return <div className="loading-div"><img className="loading-img" alt="load" src="https://i.gifer.com/origin/4d/4dc11d17f5292fd463a60aa2bbb41f6a_w200.gif" /></div>;
                    if (error) return <p>Error :(</p>;
                        const article = data.article;
                    return (
                        <div className={`article-show-page article-show-page-${colorScheme}`}>
                            <div className="article-section">
                                {currentUser && (article.author.id === currentUser.id) && 
                                    <div className="delete-btn-container">
                                      <MdDelete className={`post-delete-btn ${colorScheme}`}  
                                        onClick={this.openModal} 
                                        onMouseEnter={() => this.setState({ deleteTooltipOpen: true })}
                                        onMouseLeave={() => this.setState({ deleteTooltipOpen: false })}
                                      />
                                      <Tooltip message="Delete Article" visibility={this.state.deleteTooltipOpen}/>               
                                    </div>
                }
                                {!this.state.editingTitle ? 
                                 <h1 className="article-show-title">
                                 
                                    {article.title}

                                     { 
                                        currentUser && (article.author.id === currentUser.id) && 
                                        <div className="edit-btn-container">
                                             <MdEdit className="post-edit-btn" 
                                                onClick={this.editField} 
                                                name="Title" 
                                                id="Title"
                                                onMouseEnter={() => this.setState({titleTooltipOpen: true})}
                                                onMouseLeave={() => this.setState({ titleTooltipOpen: false })}
                                                />
                                                <Tooltip message={"Edit title"} visibility={this.state.titleTooltipOpen}/>
                                        </div>
                                       
                                     }
                                 </h1> 
                                   : 
                                    <ArticleTitleEdit cancelEdit={this.cancelEdit} 
                                    finishEdit={this.finishEdit}  id={article.id} title={article.title}/>
                                    }
                                 <h3>by {article.author.username}</h3>
                                {!this.state.editingBody ? 
                                  <p className="article-show-body" id="article-body">
                                        {currentUser && (article.author.id === currentUser.id) && 
                                            <div className="edit-btn-container">
                                                <MdEdit className="post-edit-btn" 
                                                onClick={this.editField} 
                                                name="Body"
                                                id="Body" 
                                                onMouseEnter={() => this.setState({ bodyTooltipOpen: true })}
                                                onMouseLeave={() => this.setState({ bodyTooltipOpen: false })}
                                                />
                                            <Tooltip message={"Edit body"} visibility={this.state.bodyTooltipOpen} />
                                            </div>}
                                    {article.body} 
                                  </p> 
                                   : 
                                  <ArticleBodyEdit cancelEdit={this.cancelEdit} finishEdit={this.finishEdit} id={article.id} body={article.body}/> }
                          
                                 <div className="reaction-section">
                                    {
                                        article.reactions.map(reaction => {
                                            //TODO: Wrap reaction section in its own component, maybe. 
                                            return (
                                                <div key={`shutuplint${reaction.type}`}>
                                                    <Reaction 
                                                        postType={"Article"} 
                                                        currentUser={currentUser}
                                                        postId={argument} 
                                                        reactionType={reaction.type} 
                                                        users={reaction.users} 
                                                        count={reaction.count} />
                                                </div>

                                            )
                                        })
                                    }
        
                                </div>    
                                                       
                            </div>

                              <CommentSection postType={"Article"} currentUser={currentUser} colorScheme={colorScheme}postId={argument} articleAuthorId={article.author.id} comments={article.comments}/>
                            {this.state.confirmationOpen && <ConfirmationModal title={article.title} cancel={this.closeModal} confirm={this.deleteArticle}/>}
                            <Subscription subscribeToMore={subscribeToMore} />
                        </div>
                    )
                }}
            </Query>
        )
    }

}

export default graphql(deleteArticle)(ArticleShow);




