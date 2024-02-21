
import React, { useState, useEffect } from 'react';
import { FaRegGrinSquint, FaRegLightbulb, FaRegThumbsUp, FaPepperHot } from 'react-icons/fa';
import { useMutation, gql } from '@apollo/client';
import article from './queries/article';
import image from './queries/image';

const QUERIES = { "Article": article, "ImagePost": image };
const DELETE_MUTATIONS = {
    'like': gql`${unlikePost}`,
    'funny': gql`${deleteFunny}`,
    'smart': gql`${deleteSmart}`,
    'spicy': gql`${deleteSpicy}`
};
const CREATE_MUTATIONS = {
    'like': gql`${likePost}`,
    'funny': gql`${createFunny}`,
    'smart': gql`${createSmart}`,
    'spicy': gql`${createSpicy}`
};
const ICONS = {
    'like': FaRegThumbsUp,
    'funny': FaRegGrinSquint,
    'smart': FaRegLightbulb,
    'spicy': FaPepperHot
};

const Reaction = ({ users, currentUser, reactionType, postType, postId, count }) => {
    const [currentUserState, setCurrentUserState] = useState(currentUser);
    const userReacted = currentUserState && users.includes(currentUserState.id);
    const refetch = QUERIES[postType];
    const creation = CREATE_MUTATIONS[reactionType];
    const deletion = DELETE_MUTATIONS[reactionType];
    const Tag = ICONS[reactionType];

    useEffect(() => {
        setCurrentUserState(currentUser);
    }, [currentUser]);

    const [deleteReaction] = useMutation(deletion, {
        refetchQueries: [{ query: refetch, variables: { id: postId } }]
    });

    const [createReaction] = useMutation(creation, {
        refetchQueries: [{ query: refetch, variables: { id: postId } }],
        onCompleted: (data) => {
            // Handle success if needed
        }
    });

    return (
        <div className="likes-section">
            <div className="reaction">
                {userReacted ?
                    (
                        <>
                            <span className={`reaction-${reactionType}-yes`}
                                onClick={() => {
                                    if (!currentUserState) {
                                        alert("Must be logged in to react");
                                        return false;
                                    }

                                    deleteReaction({
                                        variables: {
                                            userId: currentUserState.id,
                                            postId: postId,
                                            postType: postType
                                        }
                                    });
                                }}>
                                <Tag />
                            </span>

                            <span> {count}</span>
                        </>
                    ) : (
                        <>
                            <span className={`reaction-${reactionType}-no`}
                                onClick={() => {
                                    if (!currentUserState) {
                                        alert("Must be logged in to react");
                                        return false;
                                    }
                                    createReaction({
                                        variables: {
                                            userId: currentUserState.id,
                                            postId: postId,
                                            postType: postType
                                        }
                                    });
                                }}>
                                <Tag />
                            </span>

                            <span> {count}</span>
                        </>
                    )
                }
            </div>
        </div>
    );
}

export default Reaction;

/**
import React, { Component } from 'react';
import { FaRegGrinSquint, FaRegLightbulb, FaRegThumbsUp, FaPepperHot }from 'react-icons/fa';
import { Mutation } from 'react-apollo';
import likePost from './mutations/like_post';
import unlikePost from './mutations/unlike_post';
import createFunny from './mutations/create_funny';
import deleteFunny from './mutations/delete_funny';
import createSpicy from './mutations/create_spicy';
import deleteSpicy from './mutations/delete_spicy';
import createSmart from './mutations/create_smart';
import deleteSmart from './mutations/delete_smart';
import article from './queries/article';
import image from './queries/image';


const QUERIES = { "Article": article, "ImagePost": image };
const CREATE_MUTATIONS = {'like': likePost, 'funny': createFunny, 'smart': createSmart, "spicy": createSpicy}
const DELETE_MUTATIONS = {'like': unlikePost, 'funny': deleteFunny, 'smart': deleteSmart, "spicy": deleteSpicy}
const ICONS = { 'like': FaRegThumbsUp, 'funny': FaRegGrinSquint, 'smart': FaRegLightbulb, 'spicy': FaPepperHot}

class Reaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: this.props.currentUser
        }
    }


    componentDidUpdate(newProps) {
        if (this.state.currentUser !== this.props.currentUser) {
            this.setState({ currentUser: this.props.currentUser })
        }
    }

    render() {
        const userReacted = this.state.currentUser && this.props.users.includes(this.state.currentUser.id);
        const refetch = QUERIES[this.props.postType];
        const creation = CREATE_MUTATIONS[this.props.reactionType];
        const deletion = DELETE_MUTATIONS[this.props.reactionType];
        const Tag = ICONS[this.props.reactionType]

        return (
            <div className="likes-section">
                <div className="reaction">
                    {userReacted ?
                        <Mutation
                            mutation={deletion}
                            refetchQueries={[{ query: refetch, variables: { id: this.props.postId, } }]}
                            update={(cache, { data: { deletion } }) => {
                            }}>
                            {(deletion, loading) =>
                                !loading ? (
                                    "..."
                                ) : (
                                        <span>
                                            <span className={`reaction-${this.props.reactionType}-yes`}
                                                onClick={event => {
                                                    event.preventDefault();
                                        
                                                    if (!this.state.currentUser) {
                                                        alert("Must be logged in to react")
                                                        return false;
                                                    }
                                                    deletion({
                                                        variables: {
                                                            userId: this.state.currentUser.id,
                                                            postId: this.props.postId,
                                                            postType: this.props.postType
                                                        }
                                                    }).then(res => {
                                                        // this.setState({ body: "" })
                                                    })

                                                }}>
                                                    <Tag />
                                            </span>
                                           
                                            <span> {this.props.count}</span>
                                        </span>
                                    )}
                        </Mutation>
                        :
                        <Mutation
                            mutation={creation}
                            refetchQueries={[{ query: refetch, variables: { id: this.props.postId, } }]}
                            update={(cache, { data: { creation } }) => {
                            }}>
                            {(creation, loading) =>
                                !loading ? (
                                    "..."
                                ) : (
                                        <span>
                                            <span className={`reaction-${this.props.reactionType}-no`}
                                                onClick={event => {
                                                    event.preventDefault();
                                                    if (!this.state.currentUser) {
                                                        alert("Must be logged in to react")
                                                        return false;
                                                    }
                                                    creation({
                                                        variables: {
                                                            userId: this.state.currentUser.id,
                                                            postId: this.props.postId,
                                                            postType: this.props.postType
                                                        }
                                                    }).then(res => {
                                                        // this.setState({ body: "" })
                                                    })

                                                }}> 
                                                 <Tag />
                                            </span>
                                           
                                            <span> {this.props.count}</span>
                                        </span>
                                    )}
                        </Mutation>
                    }
                </div>
            </div>
        )
    }
}

export default Reaction */
