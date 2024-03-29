import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import search from './queries/posts_by_query';
import { parseUrl } from './helpers';
import Subscription from './search_subscription';

const Search = (props) => {
    const query = props.location.search;

    const { loading, error, data, subscribeToMore } = useQuery(search, {
        variables: { searchQuery: query },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    if (data.postsByQuery.length === 0) {
        return <h1 style={{ "color": "white", "margin": "2rem" }}>Sorry, no posts matched your query</h1>;
    }

    return (
        <div>
            <div className="search-results-spread">
                {data.postsByQuery.map(post => {
                    const url = parseUrl(post.__typename);
                    return (
                        <div className="user-posts-card" key={`${post.title}${post.title.length}${post.id}`}>
                            <h3><Link to={`${url}/${post.id}`}>{post.title}</Link></h3>
                            {post.image && <div className="user-posts-thumbnail-container"><img src={post.image} alt={post.image.title} /></div>}
                            {post.snippet && <p>{post.snippet}<span style={{ "color": "gray" }}>...</span></p>}
                        </div>
                    );
                })}
                <Subscription subscribeToMore={subscribeToMore} query={query.replace("?q=", "")} />
            </div>
        </div>
    );
};

export default Search;


//old code below
/**
import React from 'react'
import { withApollo, Query } from 'react-apollo'
import search from './queries/posts_by_query';
import {Link} from 'react-router-dom';
import {parseUrl} from './helpers';
import Subscription from './search_subscription';

/**
 * The Search component displays posts matching a search query, which is grabbed directly from the URL
 * Which is in turn generated by the search bar itself using the magic of Redirect.
 * 
 * @param {*} props 
 */
/**
const Search = (props) =>  {
        const query = props.location.search;

       return (           <div>
           <Query query={search} variables={{ searchQuery: query }}>
                {({ loading, error, data, subscribeToMore }) => {
               if (loading) return <p>Loading...</p>;
               if (error) return <p>Error :(</p>;
               if (data.postsByQuery.length === 0) {
                   return <h1 style={{"color":"white", "margin":"2rem"}}>Sorry, no posts matched your query</h1>
               }
               return (
                   <div className="search-results-spread"> 
                       {data.postsByQuery.map(post => {
                           const url = parseUrl(post.__typename)
                           return (
                               <div className="user-posts-card" key={`${post.title}${post.title.length}${post.id}`}>
                                   <h3 ><Link to={`${url}/${post.id}`}>{post.title}</Link></h3>
                                   {post.image && <div className="user-posts-thumbnail-container"><img src={post.image} alt={post.image.title} /> </div>}
                                   {post.snippet && <p>{post.snippet}<span style={{ "color": "gray" }}>...</span></p>}
                               </div>
                           )
                       })}
                       <Subscription subscribeToMore={subscribeToMore} query={query.replace("?q=", "")}/>
                   </div>
               )}}
           </Query>
        </div>
       ) 
}

export default withApollo(Search);
*/
