/** 
 * The purpose of this file is to provide a blank skeleton for the complex returns required
 * by the Mutation and Query tags.  Honestly, what was wrong with the old way, where it's done at the
 * export level?


import React, { Component } from 'react';
import { Query } from 'react-apollo';
// import QUERY from './queries/QUERY';

class ClassName extends Component {

    render() {
        if (!this.props.babaganoush) {
            return <div></div>
        }
        const argval = "this would normally come from state or props"
        return (
            <Query query={dummy} variables={{ argname: argval }}>
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :(</p>;
                    return (
                        <div >
                          
                        </div>
                    )
                }}
            </Query>
        )
    }

}

export default ClassName;
*/
