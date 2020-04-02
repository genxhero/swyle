import React, { Component } from 'react';
import images from './queries/images';
import { Query } from "react-apollo";
import {Link} from 'react-router-dom';
import Subscription from './images_subscription';
import Disclaimer from './disclaimer';

/**
 * Component for displaying all of the images in chronological order.  No analytics, no metrics,
 * no assumptions. Deal with it.
 * TODO: change to functional component
 */
class ImagesIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Query query={images}>
                {({ loading, error, data, subscribeToMore}) => {
                    if (loading) return <div className={`loading-div loading-div-${this.props.colorScheme}`}><img className="loading-img" alt="load" src="https://i.gifer.com/origin/4d/4dc11d17f5292fd463a60aa2bbb41f6a_w200.gif" /></div>;
                    if (error) return <p>Error :(</p>;


                    return (
                        <div className={`image-index-page image-index-page-${this.props.colorScheme}`}>
                            <h1>Newest Images</h1>
                            <Disclaimer />
                            <div className="image-index-spread">
                            {data.images.map(image =>
                                  {return (
                                      <div className={`image-index-card ${this.props.colorScheme}`} 
                                      key={`${image.title}${image.author.username}`}>
                                          <Link to={`/images/${image.id}`}>
                                           <img className="image-index-thumb"src={image.image} alt={image.title} />
                                          </Link>
                                          <span>by {image.author.username}</span>
                                          <span>{image.count} Comments, {image.likeCount} Likes</span>
                                      </div>
                                  )
                                      
                                  }   
                            )}
                            </div>
                            <Subscription subscribeToMore={subscribeToMore} />
                        </div>
                    )
                }}
            </Query>
        );
    }
}

export default ImagesIndex;