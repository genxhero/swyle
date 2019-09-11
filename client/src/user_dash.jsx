import React, {Component} from 'react'
import {Query} from 'react-apollo';
import postsByUser from './queries/posts_by_user';
import {Redirect, withRouter} from 'react-router-dom';

class UserDash extends Component {

    constructor(props) {
        super(props)
        this.state={currentUser: this.props.currentUser}
    }

  componentWillReceiveProps(newProps) {
      if (this.props.currentUser !== newProps.currentUser) {
          this.setState({currentUser: newProps.currentUser})
      }
  }

  render() {
      if (!this.state.currentUser) {
          return (<Redirect to="/login"/>)
      } else {
          return (
              <div className="user-dashboard">

                <div className="user-recent-activity">
                    <div className="user-posts">
                          <Query query={postsByUser} variables={{ userId: this.state.currentUser.id }}>
                              {({ loading, error, data }) => {
                                  if (loading) return <p>Loading...</p>;
                                  if (error) return <p>Error </p>;
                                    return (
                                      <div>
                                        {data.postsByUser.map( post => {
                                          return(
                                            <div className="user-posts-card" key={`${post.title}${post.id}`}>
                                                <h3>{post.title}</h3>
                                                {post.image && <div className="user-posts-thumbnail-container"><img src={post.image} /> </div>}
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

                    </div>

                </div>

              </div>
          )
      }
  }
}

export default withRouter(UserDash);