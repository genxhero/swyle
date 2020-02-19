/**
 * This is the user dashboard where the current user's recent activity is displayed.
 * Future: Also display recent posts from users that the current user follows.
 */

import React, {Component} from 'react'
import {Redirect, withRouter} from 'react-router-dom';
import UserOptions from './user_options';
import UserComments from './user_comments';
import UserPosts from './user_posts';

class UserDash extends Component {

    constructor(props) {
        super(props)
        this.state={currentUser: this.props.currentUser, currentTab: "posts"}
        this.selectTab = this.selectTab.bind(this)
    }

  componentWillReceiveProps(newProps) {
      if (this.props.currentUser !== newProps.currentUser) {
          this.setState({currentUser: newProps.currentUser})
      }
  }

  selectTab(event) {
    event.preventDefault();
    this.setState({ currentTab: event.target.getAttribute('name')});
  }

  render() {
      if (!this.state.currentUser) {
          return (<Redirect to="/login"/>)
      } else {
          const colorScheme = this.state.currentUser.colorScheme || "";
          const tabs = {"posts": <UserPosts userId = { this.state.currentUser.id } colorScheme={colorScheme}/>, 
                        "comments": <UserComments userId={this.state.currentUser.id} colorScheme={colorScheme}/>}
          return (
              <div className={`user-dashboard user-dashboard-${this.state.currentUser.colorScheme}`}>
                  <div className="user-profile">
                        <h3 className="user-dashboard-title">{this.state.currentUser.username}'s Dashboard</h3>
                        <UserOptions colorScheme={this.state.currentUser.colorScheme} userId={this.state.currentUser.id}/>
                  </div>
                  <h2 className={`user-recent-message user-recent-message-${colorScheme}`}>Your Recent Activity</h2>

                <div>


                <div className={`user-recent-activity user-recent-activity-${colorScheme}`}>  
                          <div className={`user-posts-nav user-posts-nav-${colorScheme}`}>
                              <div className={`user-posts-tab${this.state.currentTab === 'posts' ? `-active ${colorScheme}` : `-inactive ${colorScheme}`}`}
                                  name="posts"
                                  onClick={this.selectTab}
                              >
                                  Posts
                </div>
                              <div className={`user-posts-tab${this.state.currentTab === 'comments' ? `-active ${colorScheme}` : `-inactive ${colorScheme}`}`}
                                  name="comments"
                                  onClick={this.selectTab}
                              >
                                Comments
                </div>
                          </div>
                          {tabs[this.state.currentTab]} 

                </div>
            </div>

            </div>
          )
      }
  }
}

export default withRouter(UserDash);

/**
 *              <div className="user-posts">
                          <h3 style={{ "textAlign": "center", "color":"white"}}> Posts</h3>
                          <Query query={postsByUser} variables={{ userId: this.state.currentUser.id }}>
                              {({ loading, error, data }) => {
                                  if (loading) return <p>Loading...</p>;
                                  if (error) return <p>Error </p>;
                                    return (
                                      <div>
                                        {data.postsByUser.map( post => {
                                          return(
                                            <div className="user-posts-card" key={`${post.title}${post.id}`}>
                                                <h3 >{post.title}</h3>
                                                {post.image && <div className="user-posts-thumbnail-container"><img src={post.image} alt={post.image.title} /> </div>}
                                                {post.snippet && <p>{post.snippet}<span style={{"color":"gray"}}>...</span></p>}
                                            </div>
                                            )
                                      })}
                                      </div>
                                    )
                              }}
                          </Query>

                    </div>

                    <div className="user-comments">
                         <h3 style={{ "textAlign": "center", "color": "white"}}> Comments</h3>
                          <Query query={commentsByUser} variables={{ userId: this.state.currentUser.id }}>
                              {({ loading, error, data }) => {
                                  if (loading) return <p>Loading...</p>;
                                  if (error) return <p>Error </p>;
                                  return (
                                      <div>
                                          {data.commentsByUser.map(comment => {
                                              return (
                                                  <div className="user-comments-card" key={`${comment.id}`}>
                                                    <h4>You commented:</h4>
                                                    <p className="user-comments-card-body">"{comment.body}"</p>
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
 */