/**
 * Displays a single image and all of its information
 */

import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useHistory, Link } from 'react-router-dom';
import { MdDelete, MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import Subscription from './image_subscription';
import images from './queries/images';
import image from './queries/image';
import deleteImage from './mutations/delete_image';
import CommentSection from './comment_section_refactor';
import LikesSection from './likes_section';

//TODO fix the props frackup
const ImageShow = (props) => {

    const colorScheme = props.colorScheme;
    const currentUser = props.currentUser;
    const match = props.match;
    
    //const { imageID } = useParams();
    const history = useHistory();

    const [mutate] = useMutation(deleteImage);

    const deleteImageHandler = (e) => {
        e.preventDefault();
        const id = parseInt(match.params.imageID);
        mutate({
            variables: { id },
            refetchQueries: [{ query: images }]
        }).then(res => {
            history.push("/images");
        });
    };

    const { loading, error, data, subscribeToMore } = useQuery(image, {
        variables: { id: parseInt(imageID) }
    });

    if (loading) return <div className={`loading-div loading-div-${colorScheme}`}>Loading...</div>;
    if (error) return <p>Error :(</p>;

    const image = data.image;

    const ownIndex = data.imageIds.indexOf(image.id);
    const next = ownIndex === data.imageIds.length - 1 ? data.imageIds[0] : data.imageIds[ownIndex + 1];
    const prev = ownIndex === 0 ? (data.imageIds[data.imageIds.length - 1]) : data.imageIds[ownIndex - 1];

    return (
        <div className={`article-show-page article-show-page-${colorScheme}`}>
            <div style={{ flexDirection: "row", display: "flex", alignItems: "center" }}>
                <Link className="image-show-carousel" to={`/images/${prev}`}><MdNavigateBefore /></Link>
                <div style={{ flexDirection: "column", display: "flex", alignItems: "center" }}>
                    <div className="image-show-inner">
                        <img className="image-show-image" src={image.image} alt={image.title} />
                        <div className="image-delete-container">
                            {currentUser && (image.author.id === currentUser.id) &&
                                <MdDelete className="post-delete-btn" onClick={deleteImageHandler} />}
                        </div>
                        <div className="image-likes-container">
                            <LikesSection type={"ImagePost"} currentUser={currentUser} postId={parseInt(imageID)} likers={image.likers} numLikes={image.likeCount} />
                        </div>
                    </div>
                    <h2 className="image-show-title">
                        {image.title}, by {image.author.username}
                        {currentUser && (image.author.id === currentUser.id) &&
                            <span className="image-edit-btn" onClick={() => console.log('Edit title')}>Edit</span>}
                    </h2>
                    <p className="image-show-description">
                        "{image.description}"
                        {currentUser && (image.author.id === currentUser.id) &&
                            <span className="image-edit-btn" onClick={() => console.log('Edit description')}>Edit</span>}
                    </p>
                </div>
                <Link className="image-show-carousel" to={`/images/${next}`}><MdNavigateNext /></Link>
            </div>
            <CommentSection postType={"ImagePost"} currentUser={currentUser} postId={parseInt(imageID)} comments={image.comments} />
            <Subscription subscribeToMore={subscribeToMore} />
        </div>
    );
};

export default ImageShow;

/**
import React, { Component } from 'react';
import { Query, graphql } from 'react-apollo';
import image from './queries/image';
import CommentSection from './comment_section_refactor';
import LikesSection from './likes_section';
import ImageDescriptionEdit from './image_description_edit';
import ImageTitleEdit from './image_title_edit';
import {Link} from 'react-router-dom';
import $ from 'jquery';
import { MdDelete, MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import Subscription from './image_subscription';
import images from './queries/images';
import deleteImage from './mutations/delete_image';


/**
 * Displays a single image post 
 

class ImageShow extends Component {

    constructor(props) {
        super(props)
        this.state = {
            editingTitle: false,
            editingDescription: false
        }
        this.cancelEdit = this.cancelEdit.bind(this);
        this.finishEdit = this.finishEdit.bind(this);
        this.editField = this.editField.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    }
    deleteImage(e) {
        e.preventDefault();
        const id = this.props.match.params.imageID
        this.props.mutate({
            variables: { id: parseInt(id) },
            refetchQueries: [{ query: images }]
        }).then(res => {
            this.props.history.push("/images");
        })
    }

    cancelEdit(event) {
        $('body').css('overflow', 'auto');
        this.setState({ [`editing${event.target.name}`]: false })
    }

    finishEdit(field) {
        $('body').css('overflow', 'auto');
        this.setState({ [`editing${field}`]: false })
    }

    editField(event) {
        event.preventDefault();
        this.setState({ [`editing${event.target.id}`]: true });
    }

    componentDidUpdate(newProps) {

        if (newProps.match.params.imageID !== this.props.match.params.imageID) {
            this.setState({
                editingDescription: false,
                editingTitle: false
            })
        }
    }

    render() {
        const argument = parseInt(this.props.match.params.imageID)
        return (
            <Query query={image} variables={{ id: argument }}>
                {({ loading, error, data, subscribeToMore }) => {
                    if (loading) return <div className={`loading-div loading-div-${this.props.colorScheme}`}><img className="loading-img" alt="load" src="https://i.gifer.com/origin/4d/4dc11d17f5292fd463a60aa2bbb41f6a_w200.gif" /></div>;
                    if (error) return <p>Error :(</p>;
                    const image = data.image;
                    const ownIndex = data.imageIds.indexOf(image.id)
                    const next = ownIndex === data.imageIds.length - 1 ? data.imageIds[0] : data.imageIds[ownIndex + 1];
                    const prev = ownIndex === 0 ? (data.imageIds[data.imageIds.length - 1]) : data.imageIds[ownIndex - 1];
                    return (
                        <div className={`article-show-page article-show-page-${this.props.colorScheme}`}>
                            <div style={{"flexDirection": "row", "display": "flex", "alignItems":"center"}}>
                                <Link className="image-show-carousel" to={`/images/${prev}`}><MdNavigateBefore /></Link>
                                <div style={{ "flexDirection": "column", "display": "flex", "alignItems": "center"}}>
                                    <div className="image-show-inner">
                                        <img className="image-show-image" src={image.image} alt={image.title}/>
                                        <div className="image-delete-container">
                                            {data.currentUser && (image.author.id === data.currentUser.id) &&
                                                <MdDelete className="post-delete-btn" onClick={this.deleteImage}/>}
                                        </div>
                                        <div className="image-likes-container">
                                            <LikesSection type={"ImagePost"} currentUser={data.currentUser} postId={argument} likers={image.likers} numLikes={image.likeCount} />
                                        </div>  
                                    </div>
                               

                                  {  this.state.editingTitle? (
                                      <ImageTitleEdit cancelEdit={this.cancelEdit} 
                                        id={image.id} title={image.title} 
                                        finishEdit={this.finishEdit}/>
                                      ) : (
                                     <h2 className="image-show-title">                                        
                                 
                                      {image.title}, by {image.author.username}
                                      {data.currentUser && (image.author.id === data.currentUser.id) &&
                                      <span className="image-edit-btn" onClick={this.editField} name="Title" id="Title" />}  
                                    </h2>
                                      )
                                    }

                                    { this.state.editingDescription ? (
                                        <ImageDescriptionEdit cancelEdit={this.cancelEdit} 
                                         id={image.id} description={image.description} 
                                         finishEdit={this.finishEdit} />
                                    ) : (
                                    <p className="image-show-description">
                                        "{image.description}"
                                        {data.currentUser && (image.author.id === data.currentUser.id) && 
                                        <span className="image-edit-btn" onClick={this.editField} name="Description" id="Description" />}
                                    </p>
                                    )}
                              </div>
                                <Link className="image-show-carousel" to={`/images/${next}`}><MdNavigateNext /></Link>
                            </div>
                             
                            <CommentSection postType={"ImagePost"} currentUser={data.currentUser} postId={argument} comments={image.comments} />
                            <Subscription subscribeToMore={subscribeToMore} />
                        </div>
                    )
                }}
            </Query>
        )
    }

}

export default graphql(deleteImage)(ImageShow);
*/
